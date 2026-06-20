# Wayfare — Hotel & Property Booking Platform (MERN)

A full-stack property booking platform built with MongoDB, Express, React, and Node.js. Built as a portfolio project demonstrating real-world patterns: authentication & roles, search/filtering, geospatial queries, Stripe payments, image uploads, reviews, and host/admin dashboards.

## Why this project is a good portfolio piece

It demonstrates the things interviewers actually probe for in a MERN role:
- **Auth & authorization**: JWT in httpOnly cookies, role-based access control (guest/host/admin)
- **Data modeling**: normalized vs. denormalized tradeoffs (e.g. snapshotting price at booking time, denormalized rating aggregates)
- **Geospatial queries**: MongoDB `2dsphere` index for map-bounds search
- **Payments**: real Stripe Checkout + webhook-driven state transitions (not just "fake" payment forms)
- **File uploads**: Cloudinary integration via Multer
- **Validation**: Zod schemas shared across create/update flows
- **State management**: Redux Toolkit with async thunks, normalized loading/error states
- **Booking conflict logic**: date-range overlap checks, cancellation-policy-based refund calculation

## Tech Stack

**Frontend:** React 18, Vite, Redux Toolkit, React Router, Tailwind CSS, React Hook Form, React Leaflet, Recharts

**Backend:** Node.js, Express, MongoDB/Mongoose, JWT, Stripe, Cloudinary, Nodemailer, Zod

## Project Structure

```
hotel-booking-platform/
├── server/                 # Express API
│   ├── src/
│   │   ├── config/         # DB, Cloudinary, Stripe configs
│   │   ├── models/         # User, Property, Booking, Review
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # Route definitions
│   │   ├── middleware/     # Auth, error handling
│   │   ├── validators/     # Zod schemas
│   │   └── utils/          # Helpers, seed script
│   └── README.md
└── client/                 # React app
    ├── src/
    │   ├── components/     # Reusable UI + feature components
    │   ├── pages/           # Route-level pages (incl. host/ and admin/)
    │   ├── store/           # Redux slices
    │   ├── layouts/         # Page layout wrappers
    │   ├── hooks/           # Custom hooks
    │   └── utils/           # Axios instance, helpers
    └── README.md
```

## Quick Start

### 1. Backend

```bash
cd server
npm install
cp .env.example .env    # fill in MongoDB URI, Cloudinary, Stripe, SMTP creds
npm run seed             # populates demo data
npm run dev              # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev               # http://localhost:5173
```

The Vite dev server proxies `/api` requests to `localhost:5000` (see `client/vite.config.js`), so both run side-by-side without CORS issues locally.

### 3. Stripe webhook (for testing payments locally)

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Demo Accounts (after running `npm run seed`)

| Role  | Email | Password |
|---|---|---|
| Admin | admin@example.com | Admin1234 |
| Host  | host1@example.com | Host1234 |
| Host  | host2@example.com | Host1234 |
| Guest | guest1@example.com | Guest1234 |
| Guest | guest2@example.com | Guest1234 |

## Deployment

**Backend (Render, Railway, or similar):**
1. Push the `server/` folder as its own deployable service (or use a monorepo-aware host).
2. Set all variables from `.env.example` in your host's dashboard.
3. Set `CLIENT_URL` to your deployed frontend's URL (for CORS).
4. Point your Stripe webhook endpoint at `https://your-backend-url/api/payments/webhook`.

**Frontend (Vercel):**
1. Import the `client/` folder as a Vite project.
2. Since Vercel can't proxy to an external backend the way Vite's dev server does, update `client/src/utils/api.js`'s `baseURL` to your deployed backend URL (e.g. via `import.meta.env.VITE_API_BASE_URL`), and set that env var in Vercel's project settings.
3. Set CORS on the backend to allow your Vercel domain.

**Database:** MongoDB Atlas free tier (M0 cluster) is sufficient for a portfolio demo.

## Resume bullet points you can use

- *Architected and built a full-stack property booking platform (MERN) supporting three user roles, geospatial search, and Stripe-integrated payments end-to-end.*
- *Designed a booking-conflict resolution system using date-range overlap queries and policy-based refund calculations.*
- *Implemented JWT authentication with httpOnly cookies and role-based access control across 7 resource types.*
- *Built an admin analytics dashboard aggregating platform revenue and booking trends via MongoDB aggregation pipelines.*

## License

MIT — built for portfolio/educational use.
