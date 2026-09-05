const express = require("express");
const router = express.Router();

const QuizAttempt = require("../models/QuizAttempt");

router.get("/:userId", async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({
      user: req.params.userId,
    }).sort({ completedAt: -1 });

    const totalQuizzes = attempts.length;

    const averageScore =
      totalQuizzes > 0
        ? Math.round(
            attempts.reduce(
              (sum, attempt) => sum + attempt.percentage,
              0
            ) / totalQuizzes
          )
        : 0;

    const bestScore =
      totalQuizzes > 0
        ? Math.max(
            ...attempts.map((attempt) => attempt.percentage)
          )
        : 0;

    // -----------------------------
    // Subject Performance
    // -----------------------------

    const subjectData = {};

    attempts.forEach((attempt) => {
      const subject = attempt.subject || "General";

      if (!subjectData[subject]) {
        subjectData[subject] = {
          totalScore: 0,
          attempts: 0,
        };
      }

      subjectData[subject].totalScore += attempt.percentage;
      subjectData[subject].attempts += 1;
    });

    const subjectPerformance = Object.entries(
      subjectData
    ).map(([subject, data]) => ({
      subject,
      averageScore: Math.round(
        data.totalScore / data.attempts
      ),
      attempts: data.attempts,
    }));

    // -----------------------------
    // Topic Performance
    // -----------------------------

    const topicData = {};

    attempts.forEach((attempt) => {
      const topic = attempt.topic || "General";

      if (!topicData[topic]) {
        topicData[topic] = {
          totalScore: 0,
          attempts: 0,
        };
      }

      topicData[topic].totalScore += attempt.percentage;
      topicData[topic].attempts += 1;
    });

    const topicPerformance = Object.entries(
      topicData
    ).map(([topic, data]) => ({
      topic,
      averageScore: Math.round(
        data.totalScore / data.attempts
      ),
      attempts: data.attempts,
    }));

    // -----------------------------
    // Weak & Strong Areas
    // -----------------------------

    let weakArea = null;
    let strongArea = null;

    if (subjectPerformance.length > 0) {
      weakArea = subjectPerformance.reduce(
        (weakest, current) =>
          current.averageScore < weakest.averageScore
            ? current
            : weakest
      );

      strongArea = subjectPerformance.reduce(
        (strongest, current) =>
          current.averageScore > strongest.averageScore
            ? current
            : strongest
      );
    }

    res.json({
      totalQuizzes,
      averageScore,
      bestScore,
      attempts,
      subjectPerformance,
      topicPerformance,
      weakArea,
      strongArea,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);

    res.status(500).json({
      message: "Failed to fetch progress",
    });
  }
});

module.exports = router;