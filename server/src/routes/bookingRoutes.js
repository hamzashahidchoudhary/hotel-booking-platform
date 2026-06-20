import express from "express";
import {
  createBooking,
  getMyBookings,
  getHostBookings,
  getBooking,
  cancelBooking,
  completeBooking,
} from "../controllers/bookingController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../validators/validate.js";
import { createBookingSchema, cancelBookingSchema } from "../validators/bookingValidators.js";

const router = express.Router();

router.use(protect); // all booking routes require authentication

router.post("/", validate(createBookingSchema), createBooking);
router.get("/mine", getMyBookings);
router.get("/host", restrictTo("host", "admin"), getHostBookings);
router.get("/:id", getBooking);
router.patch("/:id/cancel", validate(cancelBookingSchema), cancelBooking);
router.patch("/:id/complete", restrictTo("admin"), completeBooking);

export default router;
