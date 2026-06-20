import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  toggleUserActive,
  getAllPropertiesAdmin,
  updatePropertyStatus,
  getAllBookingsAdmin,
} from "../controllers/adminController.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = express.Router();

router.use(protect, restrictTo("admin")); // every admin route requires admin role

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/toggle-active", toggleUserActive);
router.get("/properties", getAllPropertiesAdmin);
router.patch("/properties/:id/status", updatePropertyStatus);
router.get("/bookings", getAllBookingsAdmin);

export default router;
