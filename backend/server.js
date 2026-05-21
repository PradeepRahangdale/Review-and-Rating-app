require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const companiesRouter = require("./routes/companies");
const reviewsRouter = require("./routes/reviews");
const { connectMongo } = require("./config/mongodb");
const { ensureSeed } = require("./lib/seedDatabase");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

let dbReady = false;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      const allowed = [
        "http://localhost:5173",
        process.env.FRONTEND_URL,
      ].filter(Boolean);
      if (
        allowed.includes(origin) ||
        /\.vercel\.app$/i.test(origin)
      ) {
        return callback(null, true);
      }
      callback(null, true);
    },
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => {
  res.json({
    message: "Review&RATE API is running",
    health: "/api/health",
    companies: "/api/companies",
    docs: "Use /api/companies not the root URL in the browser",
  });
});

app.get("/api", (_req, res) => {
  res.json({
    endpoints: {
      health: "GET /api/health",
      companies: "GET /api/companies",
      createCompany: "POST /api/companies",
      company: "GET /api/companies/:id",
      reviews: "GET /api/reviews/company/:id",
      createReview: "POST /api/reviews",
    },
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: dbReady ? "connected" : "connecting",
  });
});

app.use((req, res, next) => {
  if (req.path.startsWith("/api") && !dbReady) {
    return res.status(503).json({
      message: "Database is connecting. Retry in a few seconds.",
    });
  }
  next();
});

app.use("/api/companies", companiesRouter);
app.use("/api/reviews", reviewsRouter);

app.use((req, res) => {
  res.status(404).json({ message: `Cannot ${req.method} ${req.path}` });
});

async function startDatabase() {
  try {
    await connectMongo(mongoose);
    console.log("MongoDB connected");
    await ensureSeed();
    dbReady = true;
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    console.error(
      "On Render: set MONGODB_URI in Environment. If SRV fails, use MONGODB_URI_DIRECT from Atlas.",
    );
  }
}

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  startDatabase();
});
