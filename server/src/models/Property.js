import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: 3000,
    },
    propertyType: {
      type: String,
      enum: ["hotel", "apartment", "villa", "guesthouse", "resort", "cabin", "hostel"],
      required: true,
    },

    // Pricing
    pricePerNight: { type: Number, required: true, min: 0 },
    cleaningFee: { type: Number, default: 0, min: 0 },
    serviceFeePercent: { type: Number, default: 10 }, // platform fee %
    currency: { type: String, default: "USD" },

    // Capacity
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    beds: { type: Number, required: true, min: 1 },
    bathrooms: { type: Number, required: true, min: 0.5 },

    // Location
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: "" },
      country: { type: String, required: true },
      zipCode: { type: String, default: "" },
      coordinates: {
        // GeoJSON for geospatial queries
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: true,
        },
      },
    },

    amenities: [
      {
        type: String,
        enum: [
          "wifi",
          "pool",
          "parking",
          "air_conditioning",
          "kitchen",
          "tv",
          "washer",
          "dryer",
          "gym",
          "breakfast",
          "pet_friendly",
          "elevator",
          "workspace",
          "heating",
          "hot_tub",
          "fireplace",
          "beach_access",
          "ski_in_out",
        ],
      },
    ],

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],

    houseRules: {
      checkInTime: { type: String, default: "15:00" },
      checkOutTime: { type: String, default: "11:00" },
      smokingAllowed: { type: Boolean, default: false },
      petsAllowed: { type: Boolean, default: false },
      partiesAllowed: { type: Boolean, default: false },
      additionalRules: { type: String, default: "" },
    },

    cancellationPolicy: {
      type: String,
      enum: ["flexible", "moderate", "strict"],
      default: "moderate",
    },

    // Blocked dates set manually by host (separate from confirmed bookings)
    blockedDates: [{ type: Date }],

    status: {
      type: String,
      enum: ["draft", "pending_review", "published", "suspended"],
      default: "published",
    },

    isActive: { type: Boolean, default: true }, // host can pause listing

    // Aggregated review stats (denormalized for fast reads)
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },

    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Geospatial index for "near me" / map-bounds search
propertySchema.index({ "location.coordinates": "2dsphere" });
// Text index for keyword search
propertySchema.index({ title: "text", description: "text", "location.city": "text" });
// Common filter combinations
propertySchema.index({ pricePerNight: 1, isActive: 1, status: 1 });

const Property = mongoose.model("Property", propertySchema);
export default Property;
