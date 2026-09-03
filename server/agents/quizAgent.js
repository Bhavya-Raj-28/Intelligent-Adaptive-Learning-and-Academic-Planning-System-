const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const quizAgent = async (profile) => {
  console.log("===== GEMINI QUIZ START =====");

  const prompt = `
Create exactly 5 multiple-choice questions for a university student.

Student information:
Department: ${profile.department || "Not specified"}
Semester: ${profile.semester || "Not specified"}
Subjects: ${(profile.subjects || []).join(", ")}
Weak Subjects: ${(profile.weakSubjects || []).join(", ")}

Focus mainly on the weak subjects.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.

Use exactly this format:

{
  "questions": [
    {
      "question": "Question text",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "answer": "Option A",
      "difficulty": "Easy"
    }
  ]
}
`;

  try {
   let response;

for (let attempt = 1; attempt <= 3; attempt++) {
  try {
    console.log(`===== GEMINI ATTEMPT ${attempt} =====`);
    const startTime = Date.now();

    response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    console.log(
  `===== GEMINI RESPONSE TIME: ${(Date.now() - startTime) / 1000}s =====`
);

    break;

  } catch (error) {
    console.error(`Gemini attempt ${attempt} failed:`, error.status);

    if (error.status !== 503 || attempt === 3) {
      throw error;
    }

    console.log("Gemini temporarily unavailable. Retrying...");
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
}

    console.log("===== GEMINI QUIZ RESPONSE RECEIVED =====");

    const text = response.text;

    console.log("RAW GEMINI RESPONSE:");
    console.log(text);

    const quiz = JSON.parse(text);

    console.log("QUESTIONS GENERATED:", quiz.questions?.length);

    if (!quiz.questions || quiz.questions.length !== 5) {
      throw new Error("Gemini did not return exactly 5 questions");
    }

    return quiz;

  } catch (error) {
    console.error("===== QUIZ AGENT ERROR =====");
    console.error(error);
    throw error;
  }
};

module.exports = quizAgent;