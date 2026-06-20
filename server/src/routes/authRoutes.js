import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../validators/authValidators.js";
import { validate } from "../validators/validate.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

// Stricter rate limit on auth endpoints to slow brute-force attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many attempts, please try again later",
});

router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.patch("/reset-password/:token", validate(resetPasswordSchema), resetPassword);
router.patch("/profile", protect, validate(updateProfileSchema), updateProfile);

export default router;
