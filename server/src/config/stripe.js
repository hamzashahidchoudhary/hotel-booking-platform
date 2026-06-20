import Stripe from "stripe";

// Stripe is optional at startup: if no key is configured yet (e.g. you're
// still wiring up the database/auth and haven't gotten to payments), the
// server should still boot. Any route that actually needs Stripe will throw
// a clear error when called, instead of crashing the whole process on launch.
const hasValidKey =
  process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes("xxxx");

if (!hasValidKey) {
  console.warn(
    "⚠️  STRIPE_SECRET_KEY is not set (or still a placeholder). Payment routes will fail until you add a real key to .env."
  );
}

const stripe = hasValidKey
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export default stripe;