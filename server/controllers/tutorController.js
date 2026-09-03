const tutorAgent = require("../agents/tutorAgent");

exports.askTutor = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    console.log("===== TUTOR REQUEST =====");
    console.log("Question:", question);

    const answer = await tutorAgent(question.trim());

    res.json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error("===== TUTOR ERROR =====");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to get AI response",
      error: error.message,
    });
  }
};