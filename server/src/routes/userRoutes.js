import express from "express";
import {
  toggleFavorite,
  getFavorites,
  getPublicProfile,
  updateAvatar,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { uploadAvatar } from "../config/cloudinary.js";

const router = express.Router();

router.get("/:id/public-profile", getPublicProfile);

router.get("/favorites", protect, getFavorites);
router.patch("/favorites/:propertyId", protect, toggleFavorite);
router.patch("/avatar", protect, uploadAvatar.single("avatar"), updateAvatar);

export default router;
