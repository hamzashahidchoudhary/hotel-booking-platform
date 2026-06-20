import express from "express";
import {
  createReview,
  getPropertyReviews,
  replyToReview,
  deleteReview,
  toggleFlagReview,
} from "../controllers/reviewController.js";
import { protect, restrictTo } from "../middleware/auth.js";
import { validate } from "../validators/validate.js";
import { createReviewSchema, hostReplySchema } from "../validators/bookingValidators.js";

const router = express.Router();

router.get("/property/:propertyId", getPropertyReviews);

router.post("/", protect, validate(createReviewSchema), createReview);
router.patch("/:id/reply", protect, restrictTo("host", "admin"), validate(hostReplySchema), replyToReview);
router.delete("/:id", protect, deleteReview);
router.patch("/:id/flag", protect, restrictTo("admin"), toggleFlagReview);

export default router;
