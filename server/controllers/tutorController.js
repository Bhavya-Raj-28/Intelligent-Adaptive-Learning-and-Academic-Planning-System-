const StudentProfile = require("../models/StudentProfile");
const QuizAttempt = require("../models/QuizAttempt");
const tutorAgent = require("../agents/tutorAgent");

exports.askTutor = async (req, res) => {
  try {
    const { question, userId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    console.log("===== TUTOR REQUEST =====");
    console.log("Question:", question);

    let profile = null;
    let weakestSubject = null;
    let weakestTopic = null;

    // Get student profile if user is logged in
    if (userId) {
      profile = await StudentProfile.findOne({
        user: userId,
      });

      // Get previous quiz attempts
      const attempts = await QuizAttempt.find({
        user: userId,
      });

      if (attempts.length > 0) {
        const subjectScores = {};
        const topicScores = {};

        attempts.forEach((attempt) => {
          const subject = attempt.subject || "General";
          const topic = attempt.topic || "General";

          // Subject performance
          if (!subjectScores[subject]) {
            subjectScores[subject] = {
              total: 0,
              count: 0,
            };
          }

          subjectScores[subject].total += attempt.percentage;
          subjectScores[subject].count += 1;

          // Topic performance
          if (!topicScores[topic]) {
            topicScores[topic] = {
              total: 0,
              count: 0,
            };
          }

          topicScores[topic].total += attempt.percentage;
          topicScores[topic].count += 1;
        });

        // Find weakest subject
        weakestSubject = Object.entries(subjectScores).reduce(
          (weakest, [subject, data]) => {
            const average = data.total / data.count;

            if (!weakest || average < weakest.average) {
              return {
                subject,
                average,
              };
            }

            return weakest;
          },
          null
        );

        // Find weakest topic
        weakestTopic = Object.entries(topicScores).reduce(
          (weakest, [topic, data]) => {
            const average = data.total / data.count;

            if (!weakest || average < weakest.average) {
              return {
                topic,
                average,
              };
            }

            return weakest;
          },
          null
        );
      }
    }

    console.log("===== TUTOR PERSONALIZATION =====");

    if (profile) {
      console.log("Student profile found");
    } else {
      console.log("No student profile found");
    }

    if (weakestSubject) {
      console.log(
        "Weakest Subject:",
        weakestSubject.subject,
        `${Math.round(weakestSubject.average)}%`
      );
    } else {
      console.log("Weakest Subject: No previous data");
    }

    if (weakestTopic) {
      console.log(
        "Weakest Topic:",
        weakestTopic.topic,
        `${Math.round(weakestTopic.average)}%`
      );
    } else {
      console.log("Weakest Topic: No previous data");
    }

    // Send personalized information to tutor agent
    const answer = await tutorAgent(
      question.trim(),
      profile,
      weakestSubject,
      weakestTopic
    );

    res.json({
      success: true,
      answer,
    });
  } catch (error) {
    console.error("===== TUTOR ERROR =====");
    console.error(error);

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Gemini API quota exceeded. Please wait and try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to get AI response",
      error: error.message,
    });
  }
};