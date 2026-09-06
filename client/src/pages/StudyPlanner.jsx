import { useState } from "react";
import { generateStudyPlan } from "../utils/plannerAgent";
import API from "../services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function StudyPlanner() {
  const [plan, setPlan] = useState([]);

  async function generatePlan() {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("User information not found. Please log in again.");
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id || user._id;

      const result = await generateStudyPlan(userId);

      setPlan(result.timetable);
    } catch (err) {
      console.error("Study Planner Error:", err);

      if (err.response?.status === 429) {
        alert(
          "AI Study Planner is temporarily unavailable because the Gemini API quota has been reached. Please try again later."
        );
      } else {
        alert(
          err.response?.data?.message ||
            "Unable to generate study plan."
        );
      }
    }
  }

  async function markComplete(taskId) {
    try {
      await API.post("/study-plan/complete", {
        taskId,
      });

      setPlan((currentPlan) =>
        currentPlan.map((item) =>
          item._id === taskId
            ? { ...item, completed: true }
            : item
        )
      );
    } catch (err) {
      console.error("Complete Task Error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to mark task as complete."
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        📅 AI Study Planner
      </h1>

      <Button onClick={generatePlan}>
        Generate Study Plan
      </Button>

      <div className="mt-8 space-y-4">

        {plan.map((item, index) => (

          <Card
            key={item._id || index}
            className="bg-slate-900 border-slate-800"
          >
            <CardContent className="p-5">

              <h2 className="text-xl font-bold text-white">
                {item.subject}
              </h2>

              <p className="text-slate-300 mt-2">
                {item.topic}
              </p>

              <p className="text-slate-300 mt-2">
                {item.task}
              </p>

              <p className="text-indigo-400 mt-2">
                {item.priority}
              </p>

              <p className="text-slate-500">
                {item.time}
              </p>

              <Button
                className="mt-4 w-full"
                onClick={() => markComplete(item._id)}
                disabled={item.completed}
              >
                {item.completed
                  ? "✅ Completed"
                  : "✅ Mark Complete"}
              </Button>

            </CardContent>
          </Card>

        ))}

      </div>

    </div>
  );
}

export default StudyPlanner;