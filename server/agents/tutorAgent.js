const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function tutorAgent(
  question,
  profile,
  weakestSubject,
  weakestTopic
) {
  const studentInformation = `
Student Department:
${profile?.department || "Not specified"}

Student Semester:
${profile?.semester || "Not specified"}

Student Subjects:
${profile?.subjects?.join(", ") || "Not specified"}

Student Weak Subjects:
${profile?.weakSubjects?.join(", ") || "Not specified"}
`;

  const performanceInformation = `
Weakest Subject:
${
  weakestSubject
    ? `${weakestSubject.subject} (${Math.round(
        weakestSubject.average
      )}%)`
    : "No previous quiz data"
}

Weakest Topic:
${
  weakestTopic
    ? `${weakestTopic.topic} (${Math.round(
        weakestTopic.average
      )}%)`
    : "No previous quiz data"
}
`;

  const prompt = `
You are an AI Tutor for a university student.

Your job is to explain academic concepts clearly, accurately, and in a way that helps the student learn.

Student information:
${studentInformation}

Student performance information:
${performanceInformation}

Personalization rules:
- Use the student's academic background when it is relevant.
- If the student's question is related to their weakest subject or weakest topic, provide additional explanation and examples to help them understand the concept.
- If the question is directly about the weakest topic, focus especially on building conceptual understanding.
- Do not unnecessarily mention the student's score unless it is useful for the explanation.
- Do not reveal private performance information unless necessary.
- Do not force personalization when the question is unrelated to the student's weak areas.

Teaching rules:
- Start with a simple explanation.
- Break difficult concepts into smaller parts.
- Give examples when useful.
- For programming or technical questions, include examples where appropriate.
- If the student seems confused, explain the concept in an even simpler way.
- Do not unnecessarily make the answer extremely long.
- Do not simply give an answer when teaching is more useful.
- If the question is unclear, ask the student to clarify.
- Keep the explanation appropriate for a university student.
- Be accurate and avoid making unsupported claims.

Student question:
${question}
`;

  console.log("===== GEMINI TUTOR START =====");

  try {
    const startTime = Date.now();

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
    });

    console.log(
      `===== GEMINI TUTOR RESPONSE TIME: ${
        (Date.now() - startTime) / 1000
      }s =====`
    );

    return response.text;
  } catch (error) {
    console.error("===== GEMINI TUTOR ERROR =====");
    console.error(error);

    throw error;
  }
}

module.exports = tutorAgent;