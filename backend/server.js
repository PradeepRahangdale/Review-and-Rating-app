require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const companiesRouter = require("./routes/companies");
const reviewsRouter = require("./routes/reviews");
const { connectMongo } = require("./config/mongodb");

const app = express();
const PORT = process.env.PORT || 5000;

const corsOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length ? corsOrigins : true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/companies", companiesRouter);
app.use("/api/reviews", reviewsRouter);

connectMongo(mongoose)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`),
    );
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
