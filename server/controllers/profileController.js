const StudentProfile = require("../models/StudentProfile");

exports.createProfile = async (req, res) => {
  try {
    const {
      user,
      department,
      semester,
      goal,
      studyHours,
      learningStyle,
      weakSubjects,
      subjects,
      examDate,
    } = req.body;

    const profile = await StudentProfile.create({
      user,
      department,
      semester,
      goal,
      studyHours,
      learningStyle,
      weakSubjects,
      subjects,
      examDate,
    });

    res.status(201).json({
      success: true,
      message: "Profile Created Successfully",
      profile,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const profile = await StudentProfile.findOne({
      user: userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Student profile not found",
      });
    }

    res.json({
      success: true,
      profile,
    });

  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};