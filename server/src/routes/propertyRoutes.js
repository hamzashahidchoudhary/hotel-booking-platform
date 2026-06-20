import express from "express";
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  deletePropertyImage,
  getMyProperties,
  togglePropertyActive,
  updateBlockedDates,
} from "../controllers/propertyController.js";
import { protect, restrictTo, optionalAuth } from "../middleware/auth.js";
import { uploadPropertyImages } from "../config/cloudinary.js";
import { validate } from "../validators/validate.js";
import {
  createPropertySchema,
  updatePropertySchema,
} from "../validators/propertyValidators.js";

const router = express.Router();

// Public routes
router.get("/", getProperties);
router.get("/:id", optionalAuth, getProperty);

// Host routes
router.get("/host/mine", protect, restrictTo("host", "admin"), getMyProperties);

router.post(
  "/",
  protect,
  restrictTo("host", "admin"),
  uploadPropertyImages.array("images", 10),
  validate(createPropertySchema),
  createProperty
);

router.patch(
  "/:id",
  protect,
  restrictTo("host", "admin"),
  uploadPropertyImages.array("images", 10),
  validate(updatePropertySchema),
  updateProperty
);

router.delete("/:id", protect, restrictTo("host", "admin"), deleteProperty);
router.delete("/:id/images/:publicId", protect, restrictTo("host", "admin"), deletePropertyImage);
router.patch("/:id/toggle-active", protect, restrictTo("host", "admin"), togglePropertyActive);
router.patch("/:id/blocked-dates", protect, restrictTo("host", "admin"), updateBlockedDates);

export default router;
