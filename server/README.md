# Hotel Booking Platform — Backend API

Node.js / Express / MongoDB REST API powering the booking platform.

## Setup

```bash
cd server
npm install
cp .env.example .env   # then fill in your real values
npm run dev             # starts on http://localhost:5000
```

## Required services (all have free tiers)

| Service | Used for | Get credentials at |
|---|---|---|
| MongoDB Atlas | Database | https://www.mongodb.com/cloud/atlas |
| Cloudinary | Image uploads | https://cloudinary.com |
| Stripe | Payments | https://dashboard.stripe.com/test/apikeys |
| Gmail (or any SMTP) | Transactional email | Use an "App Password", not your real password |

## Seed demo data

```bash
npm run seed
```

This creates 2 hosts, 2 guests, 1 admin, 4 properties, 3 bookings, and 2 reviews. Credentials are printed to the console after seeding.

## Stripe webhook (local testing)

Use the Stripe CLI to forward webhook events to your local server:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

Copy the webhook signing secret it prints into `STRIPE_WEBHOOK_SECRET` in your `.env`.

## API Overview

| Resource | Base route |
|---|---|
| Auth | `/api/auth` |
| Properties | `/api/properties` |
| Bookings | `/api/bookings` |
| Payments | `/api/payments` |
| Reviews | `/api/reviews` |
| Users | `/api/users` |
| Admin | `/api/admin` |

See `API_DOCS.md` for the full endpoint reference.
