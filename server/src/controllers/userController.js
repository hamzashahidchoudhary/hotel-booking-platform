import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Property from "../models/Property.js";

// @desc    Toggle a property in the logged-in user's favorites
// @route   PATCH /api/users/favorites/:propertyId
// @access  Private
export const toggleFavorite = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const user = await User.findById(req.user._id);
  const index = user.favorites.findIndex((id) => id.toString() === propertyId);

  let isFavorited;
  if (index > -1) {
    user.favorites.splice(index, 1);
    isFavorited = false;
  } else {
    user.favorites.push(propertyId);
    isFavorited = true;
  }

  await user.save();
  res.status(200).json({ success: true, isFavorited });
});

// @desc    Get logged-in user's favorited properties
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: "favorites",
    match: { isActive: true, status: "published" },
  });
  res.status(200).json({ success: true, favorites: user.favorites });
});

// @desc    Get public profile info for a host
// @route   GET /api/users/:id/public-profile
// @access  Public
export const getPublicProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("name avatar createdAt role");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const properties = await Property.find({
    host: user._id,
    isActive: true,
    status: "published",
  }).select("title images pricePerNight ratingsAverage ratingsCount location");

  res.status(200).json({ success: true, user, properties });
});

// @desc    Upload/update logged-in user's avatar
// @route   PATCH /api/users/avatar
// @access  Private
export const updateAvatar = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: { url: req.file.path, publicId: req.file.filename } },
    { new: true }
  );

  res.status(200).json({ success: true, user });
});
