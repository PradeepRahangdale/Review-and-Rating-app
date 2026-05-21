# Deploy Review&RATE (Live)

Deploy **backend** and **frontend** on separate free hosts. MongoDB stays on **Atlas**.

| Part | Host | Example URL |
|------|------|-------------|
| Database | MongoDB Atlas | (connection string only) |
| Backend | [Render](https://render.com) | `https://review-rating-api.onrender.com` |
| Frontend | [Vercel](https://vercel.com) | `https://review-rating-app.vercel.app` |

Repo: https://github.com/PradeepRahangdale/Review-and-Rating-app

---

## Before you start

1. Push latest code to GitHub.
2. In **MongoDB Atlas** → **Network Access** → add `0.0.0.0/0` (allow from anywhere) so Render can connect.
3. Have your **new** `MONGODB_URI` ready (database name: `review-rating`).

---

## Step 1 — Deploy backend (Render)

1. Go to [render.com](https://render.com) → sign up → **New +** → **Web Service**.
2. Connect GitHub repo `Review-and-Rating-app`.
3. Settings:

   | Field | Value |
   |-------|--------|
   | **Name** | `review-rating-api` (or any name) |
   | **Root Directory** | `backend` |
   | **Runtime** | Node |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance type** | Free |

4. **Environment variables** (Environment → Add):

   | Key | Value |
   |-----|--------|
   | `MONGODB_URI` | Your Atlas URI ending with `/review-rating?...` |
   | `MONGODB_URI_DIRECT` | *(optional)* Direct shard URI if srv fails on Render |
   | `FRONTEND_URL` | Leave empty for now; add after Step 2 |

5. Click **Create Web Service** and wait until status is **Live**.

6. Test: open `https://YOUR-BACKEND.onrender.com/api/health`  
   Expected: `{"status":"ok"}`

Copy your backend URL (no trailing slash), e.g. `https://review-rating-api.onrender.com`.

---

## Step 2 — Deploy frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) → sign up → **Add New** → **Project**.
2. Import the same GitHub repo.
3. Settings:

   | Field | Value |
   |-------|--------|
   | **Framework Preset** | Vite |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |

4. **Environment variable**:

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | Your Render backend URL from Step 1 |

5. Click **Deploy**.

6. Copy your live frontend URL, e.g. `https://review-rating-app.vercel.app`.

---

## Step 3 — Link frontend ↔ backend

1. In **Render** → your backend service → **Environment**:
   - Set `FRONTEND_URL` = your Vercel URL (e.g. `https://review-rating-app.vercel.app`)
   - Save → Render will redeploy automatically.

2. Open your **Vercel** site in the browser. You should see companies if the DB has data.

3. If the DB is empty, run seed **once** on your PC (with new URI in `backend/.env`):

   ```bash
   cd backend
   npm run seed
   ```

---

## Step 4 — Seed production data (optional)

From your machine (with `backend/.env` pointing at Atlas):

```bash
cd backend
npm run seed
```

Or add companies/reviews via the live UI.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Frontend shows errors / no data | Check `VITE_API_URL` in Vercel matches Render URL exactly (no `/` at end). Redeploy frontend after changing. |
| Backend won't start | Check `MONGODB_URI` and Atlas Network Access (`0.0.0.0/0`). |
| CORS error in browser | Set `FRONTEND_URL` on Render to your exact Vercel URL. |
| Render slow first load | Free tier sleeps after ~15 min idle; first request may take ~30s. |
| Logo upload missing later | Render free disk is ephemeral; logos may reset on redeploy. OK for demos. |

---

## Quick checklist

- [ ] Atlas: `0.0.0.0/0` in Network Access  
- [ ] Render: backend live, `/api/health` works  
- [ ] Vercel: `VITE_API_URL` set, site loads  
- [ ] Render: `FRONTEND_URL` = Vercel URL  
- [ ] Data: seed or add via UI  

---

## Alternative hosts

- **Backend:** Railway, Fly.io (same env vars: `MONGODB_URI`, `FRONTEND_URL`)
- **Frontend:** Netlify (build `frontend`, publish `dist`, set `VITE_API_URL`)
