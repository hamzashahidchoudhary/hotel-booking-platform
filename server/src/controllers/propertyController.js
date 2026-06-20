import asyncHandler from "express-async-handler";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import { deleteCloudinaryImage } from "../config/cloudinary.js";

// @desc    Get all properties with search/filter/pagination
// @route   GET /api/properties
// @access  Public
export const getProperties = asyncHandler(async (req, res) => {
  const {
    city,
    country,
    minPrice,
    maxPrice,
    guests,
    propertyType,
    amenities,
    checkIn,
    checkOut,
    swLat,
    swLng,
    neLat,
    neLng,
    sort,
    page,
    limit,
    search,
  } = req.query;

  const filter = { isActive: true, status: "published" };

  if (city) filter["location.city"] = { $regex: city, $options: "i" };
  if (country) filter["location.country"] = { $regex: country, $options: "i" };
  if (propertyType) filter.propertyType = propertyType;
  if (guests) filter.maxGuests = { $gte: Number(guests) };

  if (minPrice || maxPrice) {
    filter.pricePerNight = {};
    if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
  }

  if (amenities) {
    const amenitiesArray = amenities.split(",").map((a) => a.trim());
    filter.amenities = { $all: amenitiesArray };
  }

  // Map bounds search (geospatial box)
  if (swLat && swLng && neLat && neLng) {
    filter["location.coordinates.coordinates"] = {
      $geoWithin: {
        $box: [
          [Number(swLng), Number(swLat)],
          [Number(neLng), Number(neLat)],
        ],
      },
    };
  }

  // Free-text keyword search (title, description, city)
  if (search) {
    filter.$text = { $search: search };
  }

  let query = Property.find(filter).populate("host", "name avatar");

  // Sorting
  const sortOptions = {
    price_asc: { pricePerNight: 1 },
    price_desc: { pricePerNight: -1 },
    rating: { ratingsAverage: -1 },
    newest: { createdAt: -1 },
  };
  query = query.sort(sortOptions[sort] || { createdAt: -1 });

  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 12;
  const skip = (pageNum - 1) * limitNum;

  const total = await Property.countDocuments(filter);
  let properties = await query.skip(skip).limit(limitNum);

  // Filter out properties unavailable for the requested date range
  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const propertyIds = properties.map((p) => p._id);
    const conflictingBookings = await Booking.find({
      property: { $in: propertyIds },
      status: { $in: ["confirmed", "pending_payment"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    }).distinct("property");

    const conflictingIds = new Set(conflictingBookings.map((id) => id.toString()));
    properties = properties.filter((p) => !conflictingIds.has(p._id.toString()));
  }

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum),
    properties,
  });
});

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "host",
    "name avatar email phone createdAt"
  );

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  // Increment view count asynchronously (don't block response)
  Property.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } }).exec();

  // Attach unavailable date ranges so the frontend can disable them in the date picker
  const bookings = await Booking.find({
    property: property._id,
    status: { $in: ["confirmed", "pending_payment"] },
    checkOut: { $gte: new Date() },
  }).select("checkIn checkOut");

  const unavailableRanges = bookings.map((b) => ({ checkIn: b.checkIn, checkOut: b.checkOut }));

  res.status(200).json({
    success: true,
    property,
    unavailableRanges,
    isFavorited: req.user ? req.user.favorites?.includes(property._id) : false,
  });
});

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (host, admin)
export const createProperty = asyncHandler(async (req, res) => {
  const propertyData = { ...req.body, host: req.user._id };

  // Images uploaded via multer-storage-cloudinary land in req.files
  if (req.files && req.files.length > 0) {
    propertyData.images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
  }

  const property = await Property.create(propertyData);
  res.status(201).json({ success: true, property });
});

// @desc    Update a property listing
// @route   PATCH /api/properties/:id
// @access  Private (owning host, admin)
export const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.host.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this property");
  }

  const updateData = { ...req.body };

  if (req.files && req.files.length > 0) {
    const newImages = req.files.map((file) => ({ url: file.path, publicId: file.filename }));
    updateData.images = [...property.images, ...newImages];
  }

  const updated = await Property.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, property: updated });
});

// @desc    Remove a single image from a property
// @route   DELETE /api/properties/:id/images/:publicId
// @access  Private (owning host, admin)
export const deletePropertyImage = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  if (property.host.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { publicId } = req.params;
  await deleteCloudinaryImage(publicId);

  property.images = property.images.filter((img) => img.publicId !== publicId);
  await property.save();

  res.status(200).json({ success: true, property });
});

// @desc    Delete a property listing
// @route   DELETE /api/properties/:id
// @access  Private (owning host, admin)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  if (property.host.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this property");
  }

  // Prevent deletion if there are active future bookings
  const activeBookings = await Booking.countDocuments({
    property: property._id,
    status: { $in: ["confirmed", "pending_payment"] },
    checkOut: { $gte: new Date() },
  });

  if (activeBookings > 0) {
    res.status(400);
    throw new Error("Cannot delete property with active upcoming bookings");
  }

  // Clean up Cloudinary images
  await Promise.all(property.images.map((img) => deleteCloudinaryImage(img.publicId)));

  await property.deleteOne();
  res.status(200).json({ success: true, message: "Property deleted successfully" });
});

// @desc    Get properties owned by the logged-in host
// @route   GET /api/properties/host/mine
// @access  Private (host)
export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ host: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: properties.length, properties });
});

// @desc    Toggle pause/publish on a listing
// @route   PATCH /api/properties/:id/toggle-active
// @access  Private (owning host)
export const togglePropertyActive = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  if (property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }
  property.isActive = !property.isActive;
  await property.save();
  res.status(200).json({ success: true, property });
});

// @desc    Add/remove blocked dates (host manually blocks availability)
// @route   PATCH /api/properties/:id/blocked-dates
// @access  Private (owning host)
export const updateBlockedDates = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  if (property.host.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  const { dates } = req.body; // array of ISO date strings, replaces the full list
  property.blockedDates = dates.map((d) => new Date(d));
  await property.save();

  res.status(200).json({ success: true, property });
});
