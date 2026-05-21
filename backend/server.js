require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const companiesRouter = require("./routes/companies");
const reviewsRouter = require("./routes/reviews");

const app = express();
const PORT = process.env.PORT || 5000;
const rawMongoUri =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/review-rating";
const MONGODB_URI = rawMongoUri.replace(
  /^mongodb:\/\/localhost(?=[:\/])/,
  "mongodb://127.0.0.1",
);

console.log("Connecting to MongoDB at", MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/companies", companiesRouter);
app.use("/api/reviews", reviewsRouter);

mongoose
  .connect(MONGODB_URI)
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
