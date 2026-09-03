const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const plannerAgent = async (profile) => {

  console.log("===== CALLING GEMINI PLANNER =====");

  const subjects = Array.isArray(profile.subjects)
    ? profile.subjects.join(", ")
    : profile.subjects || "Not specified";

  const weakSubjects = Array.isArray(profile.weakSubjects)
    ? profile.weakSubjects.join(", ")
    : profile.weakSubjects || "Not specified";

  const studyHours = Number(profile.studyHours) || 2;

  const prompt = `
Create a personalized 7-day study timetable.

STUDENT:
Department: ${profile.department}
Semester: ${profile.semester}
Goal: ${profile.goal}
Daily study hours: ${studyHours}
Learning style: ${profile.learningStyle}
Subjects: ${subjects}
Weak subjects: ${weakSubjects}

You MUST create exactly 7 timetable rows.

Each row represents one day.

Each row MUST contain real data for ALL of these fields:

day
time
subject
topic
task
priority

Example of a valid row:

{
  "day": "Day 1",
  "time": "8:00 AM - 10:00 AM",
  "subject": "Deep Learning",
  "topic": "Neural Networks and Backpropagation",
  "task": "Study concepts and draw the neural network architecture",
  "priority": "High"
}

Do NOT leave any field empty.

Give weak subjects more priority.

The timetable MUST contain:
Day 1
Day 2
Day 3
Day 4
Day 5
Day 6
Day 7

After the timetable, provide:

priorityTopics
topicsToRevise
practiceRecommendations
studyTips

RETURN ONLY THIS JSON STRUCTURE:

{
  "timetable": [
    {
      "day": "Day 1",
      "time": "8:00 AM - 10:00 AM",
      "subject": "Deep Learning",
      "topic": "Neural Networks",
      "task": "Study and practice",
      "priority": "High"
    },
    {
      "day": "Day 2",
      "time": "8:00 AM - 10:00 AM",
      "subject": "CNS",
      "topic": "Cryptography",
      "task": "Study encryption techniques",
      "priority": "High"
    },
    {
      "day": "Day 3",
      "time": "8:00 AM - 10:00 AM",
      "subject": "DBMS",
      "topic": "Normalization",
      "task": "Practice normalization problems",
      "priority": "Medium"
    },
    {
      "day": "Day 4",
      "time": "8:00 AM - 10:00 AM",
      "subject": "NLP",
      "topic": "Text Processing",
      "task": "Study preprocessing techniques",
      "priority": "Medium"
    },
    {
      "day": "Day 5",
      "time": "8:00 AM - 10:00 AM",
      "subject": "Math",
      "topic": "Linear Algebra",
      "task": "Practice eigenvalues and eigenvectors",
      "priority": "Medium"
    },
    {
      "day": "Day 6",
      "time": "8:00 AM - 10:00 AM",
      "subject": "Deep Learning",
      "topic": "CNN",
      "task": "Practice CNN architecture problems",
      "priority": "High"
    },
    {
      "day": "Day 7",
      "time": "8:00 AM - 10:00 AM",
      "subject": "CNS",
      "topic": "Network Security",
      "task": "Revise and solve practice questions",
      "priority": "High"
    }
  ],
  "priorityTopics": [
    "Example topic"
  ],
  "topicsToRevise": [
    "Example revision topic"
  ],
  "practiceRecommendations": [
    "Example practice recommendation"
  ],
  "studyTips": [
    "Example study tip"
  ]
}

IMPORTANT:
Replace the example content with content based on the actual student profile.

Return ONLY JSON.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });

  let text = response.text.trim();

  console.log("===== RAW GEMINI RESPONSE =====");
  console.log(text);

  // Remove markdown fences if Gemini adds them
  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  let plan;

  try {
    plan = JSON.parse(text);
  } catch (error) {

    console.error("===== JSON PARSE ERROR =====");
    console.error(error);
    console.error("Gemini returned:", text);

    throw new Error("Gemini returned an invalid study plan format");
  }

  // Validate timetable
  if (
    !plan.timetable ||
    !Array.isArray(plan.timetable) ||
    plan.timetable.length === 0
  ) {
    throw new Error("Gemini did not generate a timetable");
  }

  console.log(
    "===== TIMETABLE ROWS =====",
    plan.timetable.length
  );

  return plan;
};

module.exports = plannerAgent;
