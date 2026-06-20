import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true, // one review per booking
    },
    guest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ratings: {
      overall: { type: Number, required: true, min: 1, max: 5 },
      cleanliness: { type: Number, min: 1, max: 5 },
      accuracy: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      location: { type: Number, min: 1, max: 5 },
      value: { type: Number, min: 1, max: 5 },
    },

    comment: { type: String, required: true, maxlength: 2000 },

    hostReply: {
      comment: { type: String, maxlength: 1000 },
      repliedAt: { type: Date },
    },

    isFlagged: { type: Boolean, default: false }, // for admin moderation
  },
  { timestamps: true }
);

reviewSchema.index({ property: 1 });

// Recalculate property's average rating whenever a review is saved/removed
reviewSchema.statics.recalculatePropertyRatings = async function (propertyId) {
  const Property = mongoose.model("Property");
  const stats = await this.aggregate([
    { $match: { property: propertyId } },
    {
      $group: {
        _id: "$property",
        avgRating: { $avg: "$ratings.overall" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Property.findByIdAndUpdate(propertyId, {
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10,
      ratingsCount: stats[0].count,
    });
  } else {
    await Property.findByIdAndUpdate(propertyId, {
      ratingsAverage: 0,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.recalculatePropertyRatings(this.property);
});

reviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) doc.constructor.recalculatePropertyRatings(doc.property);
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;
