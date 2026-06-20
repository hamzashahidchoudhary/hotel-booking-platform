import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";
import Review from "../models/Review.js";

// @desc    Get platform-wide stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private (admin)
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalHosts,
    totalProperties,
    activeProperties,
    totalBookings,
    confirmedBookings,
    totalReviews,
  ] = await Promise.all([
    User.countDocuments({ role: "user" }),
    User.countDocuments({ role: "host" }),
    Property.countDocuments(),
    Property.countDocuments({ isActive: true, status: "published" }),
    Booking.countDocuments(),
    Booking.countDocuments({ status: "confirmed" }),
    Review.countDocuments(),
  ]);

  // Revenue from completed/confirmed bookings (platform's service fee cut)
  const revenueAgg = await Booking.aggregate([
    { $match: { status: { $in: ["confirmed", "completed"] } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$priceBreakdown.total" },
        totalServiceFees: { $sum: "$priceBreakdown.serviceFee" },
      },
    },
  ]);

  // Bookings per month for the last 6 months (simple trend chart data)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyTrend = await Booking.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
        revenue: { $sum: "$priceBreakdown.total" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalHosts,
      totalProperties,
      activeProperties,
      totalBookings,
      confirmedBookings,
      totalReviews,
      totalRevenue: revenueAgg[0]?.totalRevenue || 0,
      platformEarnings: revenueAgg[0]?.totalServiceFees || 0,
      monthlyTrend,
    },
  });
});

// @desc    Get all users (with optional role filter, paginated)
// @route   GET /api/admin/users
// @access  Private (admin)
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await User.countDocuments(filter);
  const users = await User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    users,
  });
});

// @desc    Activate/deactivate a user account
// @route   PATCH /api/admin/users/:id/toggle-active
// @access  Private (admin)
export const toggleUserActive = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot deactivate an admin account");
  }
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json({ success: true, user });
});

// @desc    Get all properties for moderation (paginated)
// @route   GET /api/admin/properties
// @access  Private (admin)
export const getAllPropertiesAdmin = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Property.countDocuments(filter);
  const properties = await Property.find(filter)
    .populate("host", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: properties.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    properties,
  });
});

// @desc    Suspend or restore a property listing
// @route   PATCH /api/admin/properties/:id/status
// @access  Private (admin)
export const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'published' | 'suspended'
  if (!["published", "suspended"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  const property = await Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }
  res.status(200).json({ success: true, property });
});

// @desc    Get all bookings across the platform (paginated)
// @route   GET /api/admin/bookings
// @access  Private (admin)
export const getAllBookingsAdmin = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Booking.countDocuments(filter);
  const bookings = await Booking.find(filter)
    .populate("property", "title")
    .populate("guest", "name email")
    .populate("host", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    count: bookings.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    bookings,
  });
});
