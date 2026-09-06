
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const plannerAgent = async (
  profile,
  weakestSubject,
  weakestTopic,
  taskProgress
) => {
  console.log("===== CALLING GEMINI PLANNER =====");

  const subjects = Array.isArray(profile.subjects)
    ? profile.subjects.join(", ")
    : profile.subjects || "Not specified";

  const weakSubjects = Array.isArray(profile.weakSubjects)
    ? profile.weakSubjects.join(", ")
    : profile.weakSubjects || "Not specified";

  const studyHours = Number(profile.studyHours) || 2;
  const availableFrom = profile.availableFrom || "5:00 PM";
  const availableUntil = profile.availableUntil || "10:00 PM";

  const performanceInformation = `
Previous quiz performance:

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

  const completedTasks =
    taskProgress?.completedTasks?.length > 0
      ? taskProgress.completedTasks
          .map(
            (task) =>
              `- ${task.subject} | ${task.topic} | ${task.task}`
          )
          .join("\n")
      : "No completed study tasks yet.";

  const pendingTasks =
    taskProgress?.pendingTasks?.length > 0
      ? taskProgress.pendingTasks
          .map(
            (task) =>
              `- ${task.subject} | ${task.topic} | ${task.task}`
          )
          .join("\n")
      : "No pending study tasks.";

  const taskProgressInformation = `
PREVIOUS STUDY TASK PROGRESS:

Completed Tasks:
${completedTasks}

Pending Tasks:
${pendingTasks}
`;

  const prompt = `
Create a personalized 7-day study timetable for a university student.

STUDENT PROFILE:

Department:
${profile.department || "Not specified"}

Semester:
${profile.semester || "Not specified"}

Goal:
${profile.goal || "Not specified"}

Daily study hours:
${studyHours}

Available study time:
${availableFrom} - ${availableUntil}
Learning style:
${profile.learningStyle || "Not specified"}

Subjects:
${subjects}

Weak subjects from student profile:
${weakSubjects}

${performanceInformation}

${taskProgressInformation}

ADAPTIVE PLANNING RULES:

1. Use the student's profile to select relevant subjects and topics.

2. If previous quiz performance is available, prioritize the weakest subject.

3. If a weakest topic is available, give special attention to that topic.

4. Weak areas should receive more study time and higher priority.

5. Consider previous study-task progress when creating the new plan.

6. Do not simply repeat study tasks that the student has already completed.

7. If a task is pending, consider including it again when it is still relevant.

8. Completed tasks should be treated as already covered unless the student is still weak in that topic according to quiz performance.

9. Use completed tasks to understand what the student has already studied.

10. Use pending tasks to identify unfinished work that may need attention.

11. Do not create a timetable using unrelated subjects.

12. Respect the student's daily study hours.

13. Consider the student's learning style when creating tasks.

14. Include a mixture of:
   - Concept learning
   - Revision
   - Practice
   - Problem solving
   - Self-testing

15. The plan should help the student improve weak areas while maintaining other subjects.

16. If there is no previous quiz data, use the student's profile and weak subjects to decide priorities.

17. If there is no previous task history, create the plan normally using the student's profile and quiz performance.
18. Schedule study sessions ONLY within the student's available study time.

19. Do NOT schedule study sessions before the available start time or after the available end time.

20. The student's daily study hours indicate how much they want to study, while the available study time indicates when they are free to study.

21. If the requested daily study hours exceed the available time window, do not schedule outside the availability window. Use the maximum feasible study time instead.

22. Include reasonable breaks when creating multiple study sessions within the available time.

23. Never assume that the student is free in the morning unless their available study time includes the morning.
24. Every timetable time must fall completely between the specified available start and end times.

You MUST create exactly 7 timetable rows.

Each row represents one day.

Each row MUST contain real data for ALL of these fields:

day
time
subject
topic
task
priority

The timetable MUST contain:

Day 1
Day 2
Day 3
Day 4
Day 5
Day 6
Day 7

Do NOT leave any field empty.

Priority must be one of:

High
Medium
Low

After the timetable, provide:

priorityTopics
topicsToRevise
practiceRecommendations
studyTips

Return ONLY valid JSON.

Use exactly this structure:

{
  "timetable": [
    {
      "day": "Day 1",
      "time": "5:00 PM - 9:00 PM",
      "subject": "Subject",
      "topic": "Specific Topic",
      "task": "Study task",
      "priority": "High"
    }
  ],
  "priorityTopics": [
    "Topic 1",
    "Topic 2"
  ],
  "topicsToRevise": [
    "Topic 1",
    "Topic 2"
  ],
  "practiceRecommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ],
  "studyTips": [
    "Study tip 1",
    "Study tip 2"
  ]
}

IMPORTANT:

- Exactly 7 timetable rows.
- Use Day 1 through Day 7 exactly once.
- Every timetable row must contain all six fields.
- Prioritize the weakest subject.
- Prioritize the weakest topic when available.
- Consider completed and pending study tasks.
- Avoid unnecessarily repeating completed tasks.
- Continue relevant pending tasks when appropriate.
- Use subjects from the student's profile whenever possible.
- Do not invent unrelated academic subjects.
- Make topics specific.
- Make tasks actionable.
- Adapt the plan to the student's daily study hours.
- Strictly respect the student's available study time.
- Never schedule outside the specified availability window.
- Consider the student's learning style.

- Return ONLY JSON.
`;

  try {
    let response;

    // Retry temporary Gemini 503 errors
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `===== GEMINI PLANNER ATTEMPT ${attempt} =====`
        );

        const startTime = Date.now();

        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        console.log(
          `===== GEMINI PLANNER RESPONSE TIME: ${
            (Date.now() - startTime) / 1000
          }s =====`
        );

        break;
      } catch (error) {
        console.error(
          `Gemini planner attempt ${attempt} failed:`,
          error.status
        );

        if (
          error.status !== 503 ||
          attempt === 3
        ) {
          throw error;
        }

        console.log(
          "Gemini temporarily unavailable. Retrying in 3 seconds..."
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
      }
    }

    let text = response.text.trim();

    console.log("===== RAW GEMINI RESPONSE =====");
    console.log(text);

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

      throw new Error(
        "Gemini returned an invalid study plan format"
      );
    }

    if (
      !plan.timetable ||
      !Array.isArray(plan.timetable) ||
      plan.timetable.length !== 7
    ) {
      throw new Error(
        "Gemini did not generate exactly 7 timetable rows"
      );
    }

    plan.timetable.forEach((item, index) => {
      const requiredFields = [
        "day",
        "time",
        "subject",
        "topic",
        "task",
        "priority",
      ];

      requiredFields.forEach((field) => {
        if (!item[field]) {
          throw new Error(
            `Timetable row ${index + 1} is missing ${field}`
          );
        }
      });
    });

    if (!Array.isArray(plan.priorityTopics)) {
      throw new Error(
        "Priority topics are missing"
      );
    }

    if (!Array.isArray(plan.topicsToRevise)) {
      throw new Error(
        "Topics to revise are missing"
      );
    }

    if (
      !Array.isArray(
        plan.practiceRecommendations
      )
    ) {
      throw new Error(
        "Practice recommendations are missing"
      );
    }

    if (!Array.isArray(plan.studyTips)) {
      throw new Error(
        "Study tips are missing"
      );
    }

    console.log(
      "===== TIMETABLE VALIDATED ====="
    );

    console.log(
      "TIMETABLE ROWS:",
      plan.timetable.length
    );

    return plan;
  } catch (error) {
    console.error(
      "===== PLANNER AGENT ERROR ====="
    );
    console.error(error);

    throw error;
  }
};

module.exports = plannerAgent;

