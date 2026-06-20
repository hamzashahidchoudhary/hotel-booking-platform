import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true, min: 1 },
    guestsCount: {
      adults: { type: Number, required: true, min: 1 },
      children: { type: Number, default: 0 },
      infants: { type: Number, default: 0 },
    },

    // Price breakdown (snapshot at time of booking, so later price changes
    // to the property don't retroactively alter past bookings)
    priceBreakdown: {
      pricePerNight: { type: Number, required: true },
      subtotal: { type: Number, required: true }, // nights * pricePerNight
      cleaningFee: { type: Number, default: 0 },
      serviceFee: { type: Number, default: 0 },
      total: { type: Number, required: true },
      currency: { type: String, default: "USD" },
    },

    status: {
      type: String,
      enum: ["pending_payment", "confirmed", "cancelled", "completed", "rejected"],
      default: "pending_payment",
    },

    // Cancellation
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cancellationReason: { type: String, default: "" },
    cancelledAt: { type: Date },
    refundAmount: { type: Number, default: 0 },

    // Payment / Stripe
    payment: {
      stripeSessionId: { type: String },
      stripePaymentIntentId: { type: String },
      paidAt: { type: Date },
      refundId: { type: String },
    },

    guestNote: { type: String, maxlength: 500, default: "" }, // special requests
    hostNote: { type: String, maxlength: 500, default: "" }, // internal note from host

    // Set true once checkout date passes and stay is considered complete
    reviewEligible: { type: Boolean, default: false },
    reviewed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bookingSchema.index({ property: 1, checkIn: 1, checkOut: 1 });
bookingSchema.index({ guest: 1, status: 1 });
bookingSchema.index({ host: 1, status: 1 });

// Validation: checkOut must be after checkIn
bookingSchema.pre("validate", function (next) {
  if (this.checkOut <= this.checkIn) {
    return next(new Error("Check-out date must be after check-in date"));
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
