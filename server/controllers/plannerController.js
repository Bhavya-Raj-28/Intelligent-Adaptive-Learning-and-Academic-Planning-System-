const StudentProfile = require("../models/StudentProfile");
const plannerAgent = require("../agents/plannerAgent");

exports.generatePlan = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    console.log("===== PLANNER REQUEST =====");
    console.log("User ID:", userId);

    // Find student's saved profile
    const profile = await StudentProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    console.log("===== PROFILE FOUND =====");
    console.log(profile);

    // Send profile to Planner Agent
    const plan = await plannerAgent(profile);

    res.json({
      success: true,
      plan,
    });

  } catch (error) {
    console.error("===== PLANNER ERROR =====");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to generate study plan",
      error: error.message,
    });
  }
};