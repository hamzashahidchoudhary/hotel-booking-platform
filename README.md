<div align="center">

# 🧭 Wayfare

### A full-stack property booking platform — built with the MERN stack

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

**[Live Demo Video](#)** · **[Frontend (Vercel)](https://wayfare-booking.vercel.app)** · [Report a Bug](../../issues)

</div>

---

Wayfare is a complete Airbnb-style booking platform supporting three user roles — guests, hosts, and admins — with real Stripe payments, geospatial map search, and host/admin analytics dashboards. Built to demonstrate production-grade patterns across the full stack, not just CRUD.

## ✨ What it does

**For guests**
- Search and filter properties by price, location, guest count, amenities, and property type
- Browse results on an interactive map (Leaflet) or in a grid
- Book a stay with a conflict-aware date picker — already-booked dates are automatically blocked
- Pay securely through Stripe Checkout
- View trip history, cancel bookings (with policy-based refund calculation), and leave reviews on completed stays

**For hosts**
- A dashboard with listings, bookings, and earnings at a glance
- Create and edit listings with multi-photo upload, an interactive map pin for exact location, amenities, and house rules
- Pause, edit, or remove listings
- Reply to guest reviews

**For admins**
- Platform-wide revenue and booking-trend analytics
- User account moderation
- Property listing moderation (suspend/restore)

## 🛠️ Why this project is more than a CRUD app

| Area | What's implemented |
|---|---|
| **Auth** | JWT in httpOnly cookies, role-based access control across guest/host/admin |
| **Payments** | Real Stripe Checkout sessions + webhook-driven booking confirmation (not a fake payment form) |
| **Geospatial search** | MongoDB `2dsphere` index powering map-bounds property search |
| **Booking integrity** | Date-range overlap detection prevents double-booking; price is snapshotted at booking time so later host price changes don't retroactively affect past bookings |
| **Refund logic** | Cancellation refund amount calculated dynamically from the property's cancellation policy and time-until-check-in |
| **Validation** | Zod schemas shared across create/update flows, including parsing nested JSON from multipart form data |
| **File uploads** | Cloudinary integration via Multer for property photos and avatars |
| **Analytics** | Admin dashboard built on MongoDB aggregation pipelines (monthly booking/revenue trends) |

## 📸 Screenshots

> _Add screenshots or a GIF walkthrough here — home page, search with map, property detail, booking checkout, host dashboard, admin dashboard._

## 🧰 Tech Stack

**Frontend** — React 18 · Vite · Redux Toolkit · React Router · Tailwind CSS · React Hook Form · React Leaflet · Recharts

**Backend** — Node.js · Express · MongoDB / Mongoose · JWT · Stripe · Cloudinary · Nodemailer · Zod

**Infrastructure** — MongoDB Atlas · Vercel (frontend)

## 📁 Project Structure

```
hotel-booking-platform/
├── server/                 # Express REST API
│   └── src/
│       ├── config/         # DB, Cloudinary, Stripe configs
│       ├── models/         # User, Property, Booking, Review (Mongoose)
│       ├── controllers/    # Business logic
│       ├── routes/         # Route definitions
│       ├── middleware/     # Auth, error handling
│       ├── validators/     # Zod schemas
│       └── utils/          # Email templates, JWT helpers, seed script
└── client/                 # React SPA
    └── src/
        ├── components/     # Reusable UI + feature components
        ├── pages/          # Route-level pages (incl. host/ and admin/ dashboards)
        ├── store/          # Redux Toolkit slices
        ├── layouts/        # Page layout wrappers
        ├── hooks/          # Custom hooks
        └── utils/          # Axios instance, helpers
```

## 🚀 Running it locally

**1. Clone and install**
```bash
git clone https://github.com/hamzashahidchoudhary/hotel-booking-platform.git
cd hotel-booking-platform
```

**2. Backend**
```bash
cd server
npm install
cp .env.example .env     # add your MongoDB URI, Cloudinary, Stripe, SMTP credentials
npm run seed              # populates demo users, properties, bookings, reviews
npm run dev                # runs on http://localhost:5000
```

**3. Frontend** (new terminal)
```bash
cd client
npm install
npm run dev                # runs on http://localhost:5173
```

The Vite dev server proxies `/api` to `localhost:5000`, so both run side-by-side with no CORS setup needed locally.

**4. Stripe webhook** (optional, for testing payments)
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

### Demo accounts (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin1234 |
| Host | host1@example.com | Host1234 |
| Guest | guest1@example.com | Guest1234 |

## 🌐 Deployment notes

- **Frontend** is deployed on Vercel.
- **Backend** is containerized (see `server/Dockerfile`) and ready to deploy to any Docker-friendly host (Render, Back4app Containers, DigitalOcean App Platform, etc.) — set the environment variables listed in `server/.env.example` and point the platform's root directory at `server/`.
- **Database** runs on MongoDB Atlas (free M0 tier is sufficient).

## 📄 License

MIT — built as a portfolio project to demonstrate full-stack engineering practices. Not affiliated with any real booking service.

---

<div align="center">
Built by <a href="https://github.com/hamzashahidchoudhary">Hamza Shahid Choudhary</a>
</div>
