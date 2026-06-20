import express from "express";
import {
  createCheckoutSession,
  getStripeConfig,
} from "../controllers/paymentController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Note: the webhook route itself is registered separately in app.js
// because it requires the raw request body for Stripe signature verification.

router.get("/config", getStripeConfig);
router.post("/create-checkout-session", protect, createCheckoutSession);

export default router;
