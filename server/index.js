const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const tutorRoutes = require("./routes/tutorRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const quizRoutes = require("./routes/quizRoutes");
dotenv.config({ path: "./.env" });
console.log("MONGO_URI =", process.env.MONGO_URI);
console.log(
  "GEMINI KEY LOADED =",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

const connectDB = require("./config/db");
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:");
  console.error(err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:");
  console.error(err);
});

const app = express();


// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/quiz", quizRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 AI Learning System Backend is Running!",
  });
});

const PORT = 5000;

app.listen(PORT, "127.0.0.1", (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log("SERVER STARTED ON PORT", PORT);
  }
});