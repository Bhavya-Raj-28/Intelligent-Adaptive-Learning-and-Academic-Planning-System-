
const StudentProfile = require("../models/StudentProfile");
const QuizAttempt = require("../models/QuizAttempt");
const StudyPlan = require("../models/studyPlan");
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

    // Find previous quiz attempts
    const attempts = await QuizAttempt.find({
      user: userId,
    }).sort({ completedAt: -1 });

    console.log("===== PREVIOUS QUIZ ATTEMPTS =====");
    console.log("Total attempts:", attempts.length);

    let weakestSubject = null;
    let weakestTopic = null;

    // Analyze previous quiz performance
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

    console.log("===== PLANNER PERFORMANCE ANALYSIS =====");

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

    // Find previous study-plan tasks
    const previousTasks = await StudyPlan.find({
      user: userId,
    }).sort({ createdAt: -1 });

    const completedTasks = previousTasks.filter(
      (task) => task.completed
    );

    const pendingTasks = previousTasks.filter(
      (task) => !task.completed
    );

    console.log("===== STUDY TASK HISTORY =====");
    console.log(
      "Previous tasks:",
      previousTasks.length
    );
    console.log(
      "Completed tasks:",
      completedTasks.length
    );
    console.log(
      "Pending tasks:",
      pendingTasks.length
    );

    const taskProgress = {
      completedTasks: completedTasks.map((task) => ({
        day: task.day,
        subject: task.subject,
        topic: task.topic,
        task: task.task,
      })),

      pendingTasks: pendingTasks.map((task) => ({
        day: task.day,
        subject: task.subject,
        topic: task.topic,
        task: task.task,
      })),
    };

    console.log("===== CALLING GEMINI PLANNER =====");

    // Generate personalized study plan
    const plan = await plannerAgent(
      profile,
      weakestSubject,
      weakestTopic,
      taskProgress
    );

    console.log(
      "===== STUDY PLAN GENERATED SUCCESSFULLY ====="
    );

    // Remove the previous active study plan
    await StudyPlan.deleteMany({
      user: userId,
    });

    console.log("===== OLD STUDY PLAN REMOVED =====");

    // Convert Gemini timetable into database tasks
    const tasks = plan.timetable.map((item) => ({
      user: userId,
      day: item.day,
      time: item.time,
      subject: item.subject,
      topic: item.topic,
      task: item.task,
      priority: item.priority,
      completed: false,
    }));

    // Save the new 7-day study plan
    const savedTasks = await StudyPlan.insertMany(tasks);

    console.log(
      "===== NEW STUDY PLAN SAVED ====="
    );

    console.log(
      "Tasks saved:",
      savedTasks.length
    );

    res.json({
      success: true,
      plan,
    });
  } catch (error) {
    console.error("===== PLANNER ERROR =====");
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
      message: "Unable to generate study plan",
      error: error.message,
    });
  }
};
