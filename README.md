# Review&RATE — MERN Stack Assignment

Company review and rating platform matching the provided Figma design.

## Features

- **Add Company** — name, location, city, founded date, description, optional logo
- **Company Listing** — search, city filter, sort (name / rating / founded / date)
- **Add Review** — reviewer name, subject, review text, star rating
- **Review Listing** — sort by date, rating, or relevance; average rating; like & share

## Tech Stack

- **Frontend:** React 18, Vite, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster (or MongoDB running locally)

## Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
# Set MONGODB_URI to your Atlas connection string (database name: review-rating)
npm run seed
npm run dev
```

Backend runs at **http://localhost:5000**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

## Deploy live

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step hosting (Render root dir = `backend`, test `/api/companies`):

- **Backend** → Render (`backend` folder)
- **Frontend** → Vercel (`frontend` folder, set `VITE_API_URL`)
- **Database** → MongoDB Atlas (`review-rating` database)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | List companies (`search`, `city`, `sortBy`) |
| POST | `/api/companies` | Create company (multipart for logo) |
| GET | `/api/companies/:id` | Company details |
| GET | `/api/reviews/company/:id` | Reviews (`sortBy`: date, rating, relevance) |
| POST | `/api/reviews` | Create review |
| PATCH | `/api/reviews/:id/like` | Toggle like |

## Project Structure

```
review-rating-app/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── seed.js
└── frontend/
    └── src/
        ├── components/
        ├── pages/
        └── services/
```

## Notes for Submission

1. Start MongoDB before running the backend.
2. Run `npm run seed` once to load sample companies and reviews (or add data via the UI).
3. Screens: Home (company list) → Detail Review → Add Review modal.

## Seed data on localhost vs live site

`npm run seed` only writes to the database in **that environment’s** `MONGODB_URI`.

| Environment | What to do |
|-------------|------------|
| **Localhost** | `cd backend && npm run seed` (uses `backend/.env`) |
| **Render (production)** | Use the **same** Atlas `MONGODB_URI` in Render env vars, **or** rely on auto-seed: the server seeds automatically when the database has **zero** companies. Redeploy after pushing. |
| **Vercel (frontend)** | Set `BACKEND_URL` (or `VITE_API_URL`) to your Render URL (e.g. `https://your-app.onrender.com`) and **redeploy**. |

If the live site shows no companies, check in order:

1. Vercel → **Environment Variables** → `BACKEND_URL` = your Render backend URL (no trailing slash). Example: `https://review-and-rating.onrender.com`
2. Render → **Environment** → `MONGODB_URI` and `FRONTEND_URL` (your Vercel URL for CORS).
3. Open `https://your-backend.onrender.com/api/companies` in the browser — you should see JSON with 4 companies.
4. To force re-seed on Render: add env `SEED_RESET=true`, redeploy once, then remove it and redeploy again.
