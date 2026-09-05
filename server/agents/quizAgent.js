const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const quizAgent = async (
  profile,
  weakestSubject,
  weakestTopic
) => {
  console.log("===== GEMINI QUIZ START =====");

  const previousPerformance = `
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
Create exactly 5 multiple-choice questions for a university student.

Student information:

Department:
${profile.department || "Not specified"}

Semester:
${profile.semester || "Not specified"}

Subjects:
${(profile.subjects || []).join(", ")}

Weak Subjects:
${(profile.weakSubjects || []).join(", ")}

Previous quiz performance:
${previousPerformance}

Adaptive quiz instructions:

- If previous quiz performance is available, prioritize the student's weakest topic.
- Also consider the student's weakest subject.
- If there is no previous quiz performance, use the student's profile and weak subjects.
- The purpose of this quiz is to help the student improve in an identified weak area.

Choose ONE subject from the student's subjects or weak subjects whenever possible.

If a previous weakest topic is available, create the quiz around that topic.

If no previous weakest topic is available, choose an appropriate specific topic from one of the student's weak subjects.

Also identify the specific topic covered by the questions.

Return ONLY valid JSON.
Do not include markdown.
Do not include explanations outside the JSON.

Use exactly this format:

{
  "subject": "Subject Name",
  "topic": "Specific Topic",
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

Rules:

- Exactly 5 questions.
- All 5 questions must belong to the same subject.
- All 5 questions should focus on the same topic.
- The subject must be selected from the student's subjects or weak subjects whenever possible.
- If a weakest topic was identified from previous quiz attempts, prioritize that topic.
- The topic should be specific, such as "Sorting Algorithms", "Database Normalization", or "Operating System Scheduling".
- Difficulty can be Easy, Medium, or Hard.
- Questions should be appropriate for the student's university level.
- Do not generate questions from unrelated subjects.
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
          `===== GEMINI RESPONSE TIME: ${
            (Date.now() - startTime) / 1000
          }s =====`
        );

        break;
      } catch (error) {
        console.error(
          `Gemini attempt ${attempt} failed:`,
          error.status
        );

        if (error.status !== 503 || attempt === 3) {
          throw error;
        }

        console.log(
          "Gemini temporarily unavailable. Retrying..."
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
      }
    }

    console.log(
      "===== GEMINI QUIZ RESPONSE RECEIVED ====="
    );

    const text = response.text;

    console.log("RAW GEMINI RESPONSE:");
    console.log(text);

    const quiz = JSON.parse(text);

    console.log("QUIZ SUBJECT:", quiz.subject);
    console.log("QUIZ TOPIC:", quiz.topic);
    console.log(
      "QUESTIONS GENERATED:",
      quiz.questions?.length
    );

    // Validate subject
    if (!quiz.subject) {
      throw new Error(
        "Gemini did not return a subject"
      );
    }

    // Validate topic
    if (!quiz.topic) {
      throw new Error(
        "Gemini did not return a topic"
      );
    }

    // Validate number of questions
    if (
      !quiz.questions ||
      quiz.questions.length !== 5
    ) {
      throw new Error(
        "Gemini did not return exactly 5 questions"
      );
    }

    // Validate every question
    quiz.questions.forEach((question, index) => {
      if (!question.question) {
        throw new Error(
          `Question ${index + 1} is missing question text`
        );
      }

      if (
        !question.options ||
        question.options.length !== 4
      ) {
        throw new Error(
          `Question ${index + 1} does not have exactly 4 options`
        );
      }

      if (!question.answer) {
        throw new Error(
          `Question ${index + 1} is missing the correct answer`
        );
      }

      if (!question.difficulty) {
        throw new Error(
          `Question ${index + 1} is missing difficulty`
        );
      }
    });

    return quiz;
  } catch (error) {
    console.error("===== QUIZ AGENT ERROR =====");
    console.error(error);

    throw error;
  }
};

module.exports = quizAgent;