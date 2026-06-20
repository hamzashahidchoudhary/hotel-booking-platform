# Wayfare — Frontend (React + Vite)

## Setup

```bash
npm install
npm run dev      # http://localhost:5173, proxies /api to localhost:5000
```

For production builds talking to a separately-hosted backend:

```bash
cp .env.example .env
# set VITE_API_BASE_URL to your deployed backend's /api URL
npm run build
```

## Key directories

- `src/store/` — Redux Toolkit slices (`auth`, `properties`, `bookings`, `ui`)
- `src/pages/` — one file per route; `host/` and `admin/` hold role-specific dashboards
- `src/components/` — shared and feature components (booking widget, search bar, map, etc.)
- `src/components/ui/` — small reusable primitives (Button, Input, StarRating, loading/empty states)

## Design system

- Colors, fonts, and the signature "ticket-notch" card detail are defined in `tailwind.config.js` and `src/index.css`.
- Typography: Fraunces (display/headings) + Inter (body/UI), loaded via Google Fonts in `index.html`.
