import asyncHandler from "express-async-handler";
import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import { sendEmail, emailTemplates } from "../utils/sendEmail.js";

// Checks whether a date range overlaps any existing confirmed/pending booking
// or any host-blocked date for the given property.
const checkAvailability = async (propertyId, checkIn, checkOut, excludeBookingId = null) => {
  const query = {
    property: propertyId,
    status: { $in: ["confirmed", "pending_payment"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  };
  if (excludeBookingId) query._id = { $ne: excludeBookingId };

  const conflict = await Booking.findOne(query);
  return !conflict;
};

// @desc    Create a new booking (status: pending_payment until Stripe confirms)
// @route   POST /api/bookings
// @access  Private
export const createBooking = asyncHandler(async (req, res) => {
  const { property: propertyId, checkIn, checkOut, guestsCount, guestNote } = req.body;

  const property = await Property.findById(propertyId);
  if (!property || !property.isActive || property.status !== "published") {
    res.status(404);
    throw new Error("Property not available for booking");
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (checkInDate >= checkOutDate) {
    res.status(400);
    throw new Error("Check-out date must be after check-in date");
  }

  if (checkInDate < new Date().setHours(0, 0, 0, 0)) {
    res.status(400);
    throw new Error("Check-in date cannot be in the past");
  }

  const totalGuests = guestsCount.adults + (guestsCount.children || 0);
  if (totalGuests > property.maxGuests) {
    res.status(400);
    throw new Error(`This property accommodates a maximum of ${property.maxGuests} guests`);
  }

  // Prevent hosts from booking their own property
  if (property.host.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot book your own property");
  }

  const isAvailable = await checkAvailability(propertyId, checkInDate, checkOutDate);
  if (!isAvailable) {
    res.status(409);
    throw new Error("These dates are no longer available for this property");
  }

  // Check against host-blocked dates
  const blocked = property.blockedDates.some((bd) => {
    const blockedDate = new Date(bd);
    return blockedDate >= checkInDate && blockedDate < checkOutDate;
  });
  if (blocked) {
    res.status(409);
    throw new Error("Some of these dates have been blocked by the host");
  }

  const nights = Math.round((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
  const subtotal = nights * property.pricePerNight;
  const serviceFee = Math.round(subtotal * (property.serviceFeePercent / 100) * 100) / 100;
  const total = Math.round((subtotal + property.cleaningFee + serviceFee) * 100) / 100;

  const booking = await Booking.create({
    property: property._id,
    guest: req.user._id,
    host: property.host,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    nights,
    guestsCount,
    guestNote,
    priceBreakdown: {
      pricePerNight: property.pricePerNight,
      subtotal,
      cleaningFee: property.cleaningFee,
      serviceFee,
      total,
      currency: property.currency,
    },
    status: "pending_payment",
  });

  res.status(201).json({ success: true, booking });
});

// @desc    Get bookings for the logged-in guest
// @route   GET /api/bookings/mine
// @access  Private
export const getMyBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = { guest: req.user._id };
  if (status) filter.status = status;

  const bookings = await Booking.find(filter)
    .populate("property", "title images location pricePerNight")
    .populate("host", "name avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Get bookings for properties owned by the logged-in host
// @route   GET /api/bookings/host
// @access  Private (host)
export const getHostBookings = asyncHandler(async (req, res) => {
  const { status, propertyId } = req.query;
  const filter = { host: req.user._id };
  if (status) filter.status = status;
  if (propertyId) filter.property = propertyId;

  const bookings = await Booking.find(filter)
    .populate("property", "title images location")
    .populate("guest", "name avatar email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (guest who booked, host who owns property, admin)
export const getBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("property", "title images location pricePerNight houseRules cancellationPolicy")
    .populate("guest", "name avatar email phone")
    .populate("host", "name avatar email phone");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isParty =
    booking.guest._id.toString() === req.user._id.toString() ||
    booking.host._id.toString() === req.user._id.toString();

  if (!isParty && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Cancel a booking (guest or host can cancel)
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = asyncHandler(async (req, res) => {
  const { cancellationReason } = req.body;
  const booking = await Booking.findById(req.params.id)
    .populate("property")
    .populate("guest", "name email")
    .populate("host", "name email");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  const isGuest = booking.guest._id.toString() === req.user._id.toString();
  const isHost = booking.host._id.toString() === req.user._id.toString();

  if (!isGuest && !isHost && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }

  if (["cancelled", "completed", "rejected"].includes(booking.status)) {
    res.status(400);
    throw new Error(`Booking is already ${booking.status} and cannot be cancelled`);
  }

  // Calculate refund based on cancellation policy and time until check-in
  const hoursUntilCheckIn = (booking.checkIn - new Date()) / (1000 * 60 * 60);
  let refundPercent = 0;
  const policy = booking.property.cancellationPolicy;

  if (booking.status === "pending_payment") {
    refundPercent = 100; // never charged yet
  } else if (policy === "flexible") {
    refundPercent = hoursUntilCheckIn >= 24 ? 100 : 50;
  } else if (policy === "moderate") {
    refundPercent = hoursUntilCheckIn >= 120 ? 100 : hoursUntilCheckIn >= 24 ? 50 : 0;
  } else if (policy === "strict") {
    refundPercent = hoursUntilCheckIn >= 168 ? 50 : 0;
  }

  // Host-initiated cancellations always refund 100%
  if (isHost) refundPercent = 100;

  const refundAmount = Math.round(booking.priceBreakdown.total * (refundPercent / 100) * 100) / 100;

  booking.status = "cancelled";
  booking.cancelledBy = req.user._id;
  booking.cancellationReason = cancellationReason;
  booking.cancelledAt = new Date();
  booking.refundAmount = refundAmount;

  // Issue Stripe refund if the booking was actually paid and a refund is due
  if (booking.payment?.stripePaymentIntentId && refundAmount > 0) {
    try {
      const stripeModule = await import("../config/stripe.js");
      const refund = await stripeModule.default.refunds.create({
        payment_intent: booking.payment.stripePaymentIntentId,
        amount: Math.round(refundAmount * 100), // cents
      });
      booking.payment.refundId = refund.id;
    } catch (err) {
      console.error("Stripe refund failed:", err.message);
      // Booking is still marked cancelled; refund can be retried/handled manually via admin
    }
  }

  await booking.save();

  // Note: actual Stripe refund is triggered in paymentController if payment was captured

  try {
    await sendEmail({
      to: isGuest ? booking.host.email : booking.guest.email,
      ...emailTemplates.bookingCancelled(booking, booking.property),
    });
  } catch (err) {
    console.error("Failed to send cancellation email:", err.message);
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Mark a confirmed booking as completed (after checkout date passes)
// @route   PATCH /api/bookings/:id/complete
// @access  Private (admin, or system/cron job)
export const completeBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.status !== "confirmed") {
    res.status(400);
    throw new Error("Only confirmed bookings can be marked as completed");
  }
  booking.status = "completed";
  booking.reviewEligible = true;
  await booking.save();
  res.status(200).json({ success: true, booking });
});
