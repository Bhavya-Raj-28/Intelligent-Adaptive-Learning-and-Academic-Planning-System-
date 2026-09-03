const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  department: {
    type: String,
    required: true,
  },

  semester: {
    type: Number,
    required: true,
  },

  goal: {
    type: String,
    required: true,
  },

  studyHours: {
    type: Number,
    default: 2,
  },

  learningStyle: {
    type: String,
    default: "Visual",
  },

  weakSubjects: [
    {
      type: String,
    },
  ],

  subjects: [
    {
      type: String,
    },
  ],

  examDate: {
    type: Date,
  },
});

module.exports = mongoose.model("StudentProfile", studentProfileSchema);