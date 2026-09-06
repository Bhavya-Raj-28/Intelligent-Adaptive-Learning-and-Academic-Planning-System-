const StudentProfile = require("../models/StudentProfile");

exports.createProfile = async (req, res) => {
  try {
    const {
      user,
      department,
      semester,
      goal,
      studyHours,
      availableFrom,
      availableUntil,
      learningStyle,
      weakSubjects,
      subjects,
      examDate,
    } = req.body;

    // Check if the user already has a profile
    let profile = await StudentProfile.findOne({ user });

    if (profile) {
      // Update existing profile
      profile.department = department;
      profile.semester = semester;
      profile.goal = goal;
      profile.studyHours = studyHours;
      profile.availableFrom = availableFrom;
      profile.availableUntil = availableUntil;
      profile.learningStyle = learningStyle;
      profile.weakSubjects = weakSubjects;
      profile.subjects = subjects;
      profile.examDate = examDate;

      await profile.save();

      return res.status(200).json({
        success: true,
        message: "Profile Updated Successfully",
        profile,
      });
    }

    // Create new profile if one doesn't exist
    profile = await StudentProfile.create({
      user,
      department,
      semester,
      goal,
      studyHours,
      availableFrom,
      availableUntil,
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
    console.error("PROFILE ERROR:", error);

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