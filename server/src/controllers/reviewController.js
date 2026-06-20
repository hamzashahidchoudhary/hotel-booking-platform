import asyncHandler from "express-async-handler";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

// @desc    Create a review for a completed booking
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { booking: bookingId, ratings, comment } = req.body;

  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.guest.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to review this booking");
  }

  if (booking.status !== "completed") {
    res.status(400);
    throw new Error("You can only review completed stays");
  }

  if (booking.reviewed) {
    res.status(400);
    throw new Error("You have already reviewed this booking");
  }

  const review = await Review.create({
    property: booking.property,
    booking: booking._id,
    guest: req.user._id,
    ratings,
    comment,
  });

  booking.reviewed = true;
  await booking.save();

  res.status(201).json({ success: true, review });
});

// @desc    Get all reviews for a property (paginated)
// @route   GET /api/reviews/property/:propertyId
// @access  Public
export const getPropertyReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const filter = { property: req.params.propertyId, isFlagged: false };

  const total = await Review.countDocuments(filter);
  const reviews = await Review.find(filter)
    .populate("guest", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    reviews,
  });
});

// @desc    Host replies to a review
// @route   PATCH /api/reviews/:id/reply
// @access  Private (host of the property being reviewed)
export const replyToReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id).populate("property", "host");

  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized to reply to this review");
  }

  review.hostReply = { comment: req.body.comment, repliedAt: new Date() };
  await review.save();

  res.status(200).json({ success: true, review });
});

// @desc    Delete a review (review author or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }

  if (review.guest.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  await Booking.findByIdAndUpdate(review.booking, { reviewed: false });
  await Review.findOneAndDelete({ _id: review._id }); // triggers post-hook to recalc ratings

  res.status(200).json({ success: true, message: "Review deleted" });
});

// @desc    Flag/unflag a review for moderation
// @route   PATCH /api/reviews/:id/flag
// @access  Private (admin)
export const toggleFlagReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error("Review not found");
  }
  review.isFlagged = !review.isFlagged;
  await review.save();
  res.status(200).json({ success: true, review });
});
