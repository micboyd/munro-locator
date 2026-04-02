# Munro Locator

A web application for planning and tracking Scottish Munro climbs. Browse a comprehensive database of Scottish mountains, plan trips, log completed summits, and explore mountains on an interactive map — all in one place.

> **Munro**: A Scottish mountain with a height over 3,000 feet (914m), named after Sir Hugh Munro who catalogued them in 1891.

---

## Features

- **Mountain Library** — Browse and search all Scottish Munros, filterable by category and sortable by height
- **Trip Planner** — Create multi-day trips, add multiple mountains per trip, and track completion progress
- **Summit Log** — Record completed climbs with dates, times, and star ratings
- **Interactive Map** — Visualise your planned and completed mountains on a Leaflet map
- **Weather Forecast** — View live weather conditions at any mountain via the OpenMeteo API
- **Naismith's Rule Calculator** — Estimate hiking duration based on distance, elevation gain, and your current location
- **User Profiles** — Manage your profile, set climbing goals, and view activity statistics
- **Authentication** — Secure JWT-based auth with email confirmation

---

## Tech Stack

| Area | Technology |
|------|-----------|
| Frontend | Angular 19, TypeScript 5.7 |
| Styling | Tailwind CSS 4, FontAwesome |
| Maps | Leaflet, Mapbox |
| Weather | OpenMeteo API (free, no key required) |
| Auth | JWT (`@auth0/angular-jwt`) |
| Reactive | RxJS 7 |
| Build | Angular CLI, Vite |
| Deployment | Netlify (frontend), Heroku (backend API) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (bundled with Node.js)
- A [Mapbox](https://www.mapbox.com/) account and access token (free tier available)
- The munro-locator backend API running locally or accessible remotely

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/munro-locator.git
cd munro-locator

# Install dependencies
npm install
```

### Environment Configuration

The app uses Angular environment files located in `src/environments/`.

Open `src/environments/environment.ts` and update the values:

```ts
export const environment = {
  production: false,
  baseApiUrl: 'http://localhost:3000/api',  // Your local backend URL
  mapboxToken: 'YOUR_MAPBOX_TOKEN_HERE'
};
```

For production builds, update `src/environments/environment.prod.ts` accordingly (or use Netlify environment variable substitution — see [Deployment](#deployment)).

### Running the Development Server

```bash
npm start
```

The app will be available at `http://localhost:4200/` and will automatically reload on file changes.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on `localhost:4200` |
| `npm run build` | Build for production (output to `dist/munro-locator/browser/`) |
| `npm run watch` | Build in watch mode (useful alongside a backend dev server) |
| `npm test` | Run unit tests with Karma and Jasmine |

---

## Project Structure

```
munro-locator/
├── src/
│   ├── app/
│   │   ├── authentication/        # Login, register, and email confirmation pages
│   │   ├── dashboard/             # Main authenticated area
│   │   │   ├── board/             # Planned & completed mountains dashboard
│   │   │   │   ├── trip-plans/    # Trip listing
│   │   │   │   ├── trip-plan-form/
│   │   │   │   └── trip-plan-detail/
│   │   │   ├── library/           # Browse all Munros
│   │   │   └── profile/           # User profile and goals
│   │   └── shared/
│   │       ├── components/        # Reusable UI (map, weather, naismith, dialogs, etc.)
│   │       ├── services/          # API, auth, weather, Naismith, and trip plan services
│   │       ├── models/            # TypeScript models (Mountain, TripPlan, Profile, etc.)
│   │       └── guards/            # Route authentication guard
│   ├── environments/              # Dev and production config
│   └── styles.css                 # Global styles
├── public/
│   └── filtered_munros.json       # Static Munro dataset
├── netlify.toml                   # Netlify deployment config
└── angular.json                   # Angular CLI config
```

---

## Core Functionality

### Mountain Library

Browse all Munros with search, category filters, and height sorting. Click any mountain to view its details — including coordinates, region, height, and category — alongside a map pin and live weather forecast.

### Trip Planning

Create a named trip with a date range, then add as many mountains as you like. The trip detail view tracks how many mountains you've completed within that trip (e.g. "3/5 completed").

### Logging Summits

From your dashboard, mark a planned mountain as completed. You'll be prompted to enter the completion date, time, and a 1–5 star difficulty rating.

### Naismith's Rule Calculator

Select any mountain to get an estimated hiking time using [Naismith's Rule](https://en.wikipedia.org/wiki/Naismith%27s_rule):

```
Total time = (distance ÷ 5 km/h) + (elevation gain ÷ 600 m/h)
```

The calculator uses your browser's geolocation to determine your starting elevation and distance to the summit.

### Interactive Map

All your planned and completed mountains are plotted on a Leaflet-powered map. Click any pin to view mountain details directly from the map.

---

## Authentication

1. **Register** — Create an account with a username and password
2. **Confirm Email** — A confirmation link is sent to your email (required before login)
3. **Login** — Receive a JWT stored in `localStorage`
4. **Protected Routes** — All dashboard routes require a valid, non-expired JWT

---

## Deployment

The frontend is configured for [Netlify](https://netlify.com) deployment. The `netlify.toml` handles:

- Build command and output directory
- SPA redirect rules (all routes resolve to `index.html`)
- `MAPBOX_TOKEN` environment variable substitution into `environment.prod.ts`

### Steps to Deploy

1. Push the repository to GitHub
2. Connect the repo to a Netlify project
3. Add `MAPBOX_TOKEN` in **Netlify > Site settings > Environment variables**
4. Netlify will automatically build and deploy on every push to `main`

The production backend API is hosted on Heroku at:
```
https://munro-app-5e671249297e.herokuapp.com/api
```

---

## Backend API

The frontend expects a REST API with the following resource groups:

| Resource | Endpoints |
|----------|-----------|
| Auth | `POST /auth/login`, `POST /auth/register`, `GET /auth/confirm` |
| Mountains | `GET /mountains` (paginated, filterable) |
| Planned | `GET/POST/DELETE /planned-mountains` |
| Completed | `GET/POST /completed-mountains` |
| Trip Plans | `GET/POST/PUT/DELETE /trip-plans` |
| Profile | `GET/PUT /profile`, `GET /profile/stats`, `GET /profile/activity` |
| Goals | `GET/POST/PUT/DELETE /goals` |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## License

This project is for personal and educational use. Mountain data sourced from publicly available Munro records.
