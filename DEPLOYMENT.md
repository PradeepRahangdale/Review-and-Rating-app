# Deploy Review&RATE (Vercel + Render + Atlas)

## 1. MongoDB Atlas

1. Create cluster → **Connect** → Drivers → copy connection string.
2. Database name: `review-rating`
3. **Network Access** → Add IP: `0.0.0.0/0` (allow Render)
4. If `mongodb+srv://` fails on Render, use **Connect** → copy the **non-SRV** URI and set as `MONGODB_URI_DIRECT` on Render.

---

## 2. Render (backend)

1. [render.com](https://render.com) → **New** → **Web Service** → connect GitHub repo.
2. Settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Health Check Path** | `/api/health` |

3. **Environment Variables:**

| Key | Value |
|-----|--------|
| `MONGODB_URI` | Your Atlas connection string |
| `FRONTEND_URL` | `https://review-and-rating-app.vercel.app` |
| `NODE_VERSION` | `20` |

Optional: `MONGODB_URI_DIRECT` if SRV lookup fails on Render.

4. Deploy → copy your service URL, e.g. `https://review-and-rating-app.onrender.com`

### Test backend (important)

Open in browser:

- `https://YOUR-RENDER-URL.onrender.com/` → JSON “API is running”
- `https://YOUR-RENDER-URL.onrender.com/api/health` → `{ "status": "ok", "database": "connected" }`
- `https://YOUR-RENDER-URL.onrender.com/api/companies` → list of companies

**“Cannot GET /”** on the root without `/api` means you opened the wrong path — use `/api/companies`.

---

## 3. Vercel (frontend)

1. Import repo → **Root Directory**: `frontend`
2. **Environment Variables:**

| Key | Value |
|-----|--------|
| `BACKEND_URL` | Optional. Default is already `https://review-and-rating-app.onrender.com` in the repo. |

3. **Redeploy** after pushing latest code (or after changing env vars).

### Test frontend

1. Open `https://review-and-rating-app.vercel.app`
2. Companies should load (Result Found > 0).
3. Add Company should work (no 405 error).

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Cannot GET /` on Render URL | Use `/api/companies` or `/api/health`, not `/` only |
| `database: "connecting"` forever | Check `MONGODB_URI`, Atlas IP whitelist, try `MONGODB_URI_DIRECT` |
| 405 on Vercel | Set `BACKEND_URL` on Vercel and redeploy |
| Empty companies on live site | Open Render `/api/companies` — if empty, redeploy Render (auto-seed runs when DB is empty) |
| CORS errors | Set `FRONTEND_URL` on Render to your exact Vercel URL |
