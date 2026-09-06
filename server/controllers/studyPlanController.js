const StudyPlan = require("../models/studyPlan");

exports.saveStudyPlan = async (req, res) => {
  try {
    const {
      userId,
      timetable,
      priorityTopics,
      topicsToRevise,
      practiceRecommendations,
      studyTips,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (
      !timetable ||
      !Array.isArray(timetable) ||
      timetable.length !== 7
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid 7-day timetable is required",
      });
    }

    // Remove any previous active plan
    await StudyPlan.deleteMany({
      user: userId,
    });

    // Convert each timetable row into a database task
    const tasks = timetable.map((item) => ({
      user: userId,
      day: item.day,
      time: item.time,
      subject: item.subject,
      topic: item.topic,
      task: item.task,
      priority: item.priority,
      completed: false,
    }));

    const savedTasks = await StudyPlan.insertMany(tasks);

    res.status(201).json({
      success: true,
      message: "Study plan saved successfully",
      tasks: savedTasks,
    });
  } catch (error) {
    console.error("===== SAVE STUDY PLAN ERROR =====");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to save study plan",
    });
  }
};


exports.getStudyPlan = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const tasks = await StudyPlan.find({
      user: userId,
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("===== GET STUDY PLAN ERROR =====");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch study plan",
    });
  }
};


exports.completeStudyTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    const task = await StudyPlan.findByIdAndUpdate(
      taskId,
      {
        completed: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Study task not found",
      });
    }

    res.json({
      success: true,
      message: "Study task completed",
      task,
    });
  } catch (error) {
    console.error("===== COMPLETE STUDY TASK ERROR =====");
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to complete study task",
    });
  }
};