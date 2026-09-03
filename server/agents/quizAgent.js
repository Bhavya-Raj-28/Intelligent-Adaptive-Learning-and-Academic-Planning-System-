const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const quizAgent = async (profile) => {

  console.log("===== GEMINI QUIZ START =====");

  const prompt = `
Create a 5-question adaptive MCQ quiz for this student.

Department: ${profile.department || "Not specified"}
Semester: ${profile.semester || "Not specified"}
Weak Subjects: ${(profile.weakSubjects || []).join(", ")}
Subjects: ${(profile.subjects || []).join(", ")}

Rules:
- Exactly 5 questions
- Exactly 4 options per question
- One correct answer
- Focus more on weak subjects
- Mix Easy, Medium and Hard
- Keep questions suitable for the student's semester
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  console.log("===== GEMINI QUIZ RESPONSE RECEIVED =====");

  const text = response.text;

  console.log("Gemini response length:", text.length);

  return JSON.parse(text);
};

module.exports = quizAgent;