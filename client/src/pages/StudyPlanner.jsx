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

  const completedTasks = plan.filter((item) => item.completed).length;
  const completionPercentage =
    plan.length > 0
      ? Math.round((completedTasks / plan.length) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 md:px-10">

      {/* Header */}
      <div className="mx-auto max-w-6xl">

        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              <span>✨</span>
              AI-Powered Planning
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              AI Study Planner
            </h1>

            <p className="mt-2 max-w-2xl text-slate-500">
              Get a personalized study schedule designed around your
              subjects, goals, weak areas, and available study time.
            </p>
          </div>

          <Button
            onClick={generatePlan}
            className="rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-7 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            ✨ Generate Study Plan
          </Button>

        </div>


        {/* Progress Summary */}
        {plan.length > 0 && (
          <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 p-6 text-white shadow-lg">

            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-white/80">
                  Your Study Progress
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Keep going — you're doing great! 🚀
                </h2>

                <p className="mt-1 text-sm text-white/80">
                  {completedTasks} of {plan.length} tasks completed
                </p>
              </div>

              <div className="flex items-center gap-5">

                <div className="h-20 w-20 rounded-full border-4 border-white/30 bg-white/10 flex items-center justify-center">
                  <span className="text-xl font-extrabold">
                    {completionPercentage}%
                  </span>
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm text-white/80">
                    Completion
                  </p>

                  <div className="mt-2 h-2 w-40 overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-500"
                      style={{
                        width: `${completionPercentage}%`,
                      }}
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}


        {/* Empty State */}
        {plan.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 via-cyan-100 to-emerald-100 text-4xl">
              📅
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Your personalized plan starts here
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-500">
              Let EduAI create a study schedule tailored to your
              subjects, weak areas, learning goals, and available time.
            </p>

            <Button
              onClick={generatePlan}
              className="mt-6 rounded-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-8 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              🚀 Create My Study Plan
            </Button>

          </div>
        )}


        {/* Study Plan */}
        {plan.length > 0 && (
          <div>

            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">
                Your Study Schedule
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete each task to track your learning progress.
              </p>
            </div>


            <div className="grid gap-5 md:grid-cols-2">

              {plan.map((item, index) => (

                <Card
                  key={item._id || index}
                  className={`overflow-hidden rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    item.completed
                      ? "border-emerald-200 bg-emerald-50/60"
                      : "border-slate-200 bg-white"
                  }`}
                >

                  <CardContent className="p-6">

                    {/* Card Top */}
                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-xl">
                          📚
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {item.subject}
                          </h3>

                          <p className="text-sm text-slate-500">
                            {item.time}
                          </p>
                        </div>

                      </div>


                      {/* Priority */}
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.priority?.toLowerCase() === "high"
                            ? "bg-red-50 text-red-600"
                            : item.priority?.toLowerCase() === "medium"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {item.priority}
                      </span>

                    </div>


                    {/* Topic */}
                    <div className="mt-6">

                      <p className="text-xs font-bold uppercase tracking-wider text-blue-500">
                        Topic
                      </p>

                      <p className="mt-1 text-base font-semibold text-slate-800">
                        {item.topic}
                      </p>

                    </div>


                    {/* Task */}
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4">

                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Task
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {item.task}
                      </p>

                    </div>


                    {/* Complete Button */}
                    <Button
                      className={`mt-5 w-full rounded-2xl py-3 font-semibold transition-all ${
                        item.completed
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg"
                      }`}
                      onClick={() => markComplete(item._id)}
                      disabled={item.completed}
                    >
                      {item.completed
                        ? "✓ Completed"
                        : "✓ Mark Complete"}
                    </Button>

                  </CardContent>

                </Card>

              ))}

            </div>

          </div>
        )}

      </div>

    </div>
  );
}

export default StudyPlanner;
