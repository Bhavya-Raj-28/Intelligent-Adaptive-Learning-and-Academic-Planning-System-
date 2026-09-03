const StudentProfile = require("../models/StudentProfile");
const quizAgent = require("../agents/quizAgent");

exports.generateQuiz = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("===== QUIZ REQUEST =====");
    console.log("User ID:", userId);

    const profile = await StudentProfile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    console.log("===== PROFILE FOUND =====");
    console.log(profile);

    console.log("===== CALLING GEMINI QUIZ =====");

    const quiz = await quizAgent(profile);

    console.log("===== QUIZ GENERATED SUCCESSFULLY =====");

    res.json({
      success: true,
      quiz,
    });

  } catch (error) {
    console.error("===== QUIZ ERROR =====");
    console.error(error);

    // Gemini quota exceeded
    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Gemini API quota exceeded. Please wait and try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Unable to generate quiz",
      error: error.message,
    });
  }
};