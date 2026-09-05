const express = require("express");

const router = express.Router();

const {
  generateQuiz,
} = require("../controllers/quizController");

const QuizAttempt = require("../models/QuizAttempt");

// Generate quiz
router.post("/generate", generateQuiz);

// Save completed quiz
router.post("/submit", async (req, res) => {
  try {
    const {
      userId,
      subject,
      topic,
      score,
      totalQuestions,
    } = req.body;

    if (!userId || !subject || score === undefined || !totalQuestions) {
      return res.status(400).json({
        message: "Missing required quiz information",
      });
    }

    const percentage = Math.round((score / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      user: userId,
      subject,
      topic: topic || "General",
      score,
      totalQuestions,
      percentage,
    });

    res.status(201).json({
      message: "Quiz result saved successfully",
      attempt,
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);

    res.status(500).json({
      message: "Failed to save quiz result",
    });
  }
});

module.exports = router;