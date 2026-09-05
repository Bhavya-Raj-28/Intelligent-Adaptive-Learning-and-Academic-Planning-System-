const express = require("express");

const router = express.Router();

const {
  saveStudyPlan,
  getStudyPlan,
  completeStudyTask,
} = require("../controllers/studyPlanController");

// Save a newly generated study plan
router.post("/save", saveStudyPlan);

// Get the student's saved study plan
router.get("/:userId", getStudyPlan);

// Mark a study task as completed
router.post("/complete", completeStudyTask);

module.exports = router;