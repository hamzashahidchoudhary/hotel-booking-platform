import asyncHandler from "express-async-handler";
import stripe from "../config/stripe.js";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import { sendEmail, emailTemplates } from "../utils/sendEmail.js";

// @desc    Create a Stripe Checkout session for a pending booking
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = asyncHandler(async (req, res) => {
  if (!stripe) {
    res.status(503);
    throw new Error("Payments are not configured on this server yet (missing Stripe API key)");
  }

  const { bookingId } = req.body;

  const booking = await Booking.findById(bookingId).populate("property", "title images");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.guest.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to pay for this booking");
  }

  if (booking.status !== "pending_payment") {
    res.status(400);
    throw new Error(`Booking is already ${booking.status}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: req.user.email,
    line_items: [
      {
        price_data: {
          currency: booking.priceBreakdown.currency.toLowerCase(),
          product_data: {
            name: booking.property.title,
            description: `${booking.nights} night(s): ${new Date(
              booking.checkIn
            ).toDateString()} - ${new Date(booking.checkOut).toDateString()}`,
            images: booking.property.images?.[0]?.url ? [booking.property.images[0].url] : [],
          },
          unit_amount: Math.round(booking.priceBreakdown.total * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      bookingId: booking._id.toString(),
    },
    success_url: `${process.env.CLIENT_URL}/bookings/${booking._id}?payment=success`,
    cancel_url: `${process.env.CLIENT_URL}/bookings/${booking._id}?payment=cancelled`,
  });

  booking.payment.stripeSessionId = session.id;
  await booking.save();

  res.status(200).json({ success: true, url: session.url, sessionId: session.id });
});

// @desc    Stripe webhook - confirms booking once payment succeeds
// @route   POST /api/payments/webhook
// @access  Public (verified via Stripe signature)
export const stripeWebhook = asyncHandler(async (req, res) => {
  if (!stripe) {
    return res.status(503).json({ received: false, message: "Stripe is not configured" });
  }

  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const bookingId = session.metadata.bookingId;

    const booking = await Booking.findById(bookingId)
      .populate("property", "title host")
      .populate("guest", "name email")
      .populate("host", "name email");

    if (booking && booking.status === "pending_payment") {
      booking.status = "confirmed";
      booking.payment.stripePaymentIntentId = session.payment_intent;
      booking.payment.paidAt = new Date();
      await booking.save();

      // Fire-and-forget confirmation emails to both parties
      try {
        await sendEmail({
          to: booking.guest.email,
          ...emailTemplates.bookingConfirmed(booking, booking.property),
        });
        await sendEmail({
          to: booking.host.email,
          ...emailTemplates.newBookingForHost(booking, booking.property, booking.guest),
        });
      } catch (err) {
        console.error("Failed to send booking confirmation emails:", err.message);
      }
    }
  }

  // Handle async refund completion (e.g. if refund was disputed/processed later)
  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    await Booking.findOneAndUpdate(
      { "payment.stripePaymentIntentId": charge.payment_intent },
      { "payment.refundId": charge.refunds?.data?.[0]?.id }
    );
  }

  res.status(200).json({ received: true });
});

// @desc    Get Stripe publishable key (frontend needs this to init Stripe.js)
// @route   GET /api/payments/config
// @access  Public
export const getStripeConfig = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});
