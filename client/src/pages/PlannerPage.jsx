import { useEffect, useState } from "react";
import { generateStudyPlan } from "../utils/plannerAgent";
import API from "../services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {
  const [plan, setPlan] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Get logged-in user's ID
  function getUserId() {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      return null;
    }

    try {
      const user = JSON.parse(storedUser);
      return user.id || user._id;
    } catch (error) {
      console.error("Unable to read logged-in user:", error);
      return null;
    }
  }

  // Fetch saved study plan from MongoDB
  async function fetchSavedPlan() {
    try {
      setLoadingTasks(true);

      const userId = getUserId();

      if (!userId) {
        console.log("No logged-in user found.");
        return;
      }

      const response = await API.get(`/study-plan/${userId}`);

      const savedTasks = response.data.tasks || [];

      console.log("===== SAVED STUDY PLAN =====");
      console.log(savedTasks);

      setTasks(savedTasks);

      // If saved tasks exist, rebuild the timetable
      if (savedTasks.length > 0) {
        setPlan((previousPlan) => ({
          ...(previousPlan || {}),
          timetable: savedTasks,
        }));
      }
    } catch (error) {
      console.error("ERROR FETCHING SAVED STUDY PLAN:", error);
    } finally {
      setLoadingTasks(false);
    }
  }

  // Load saved plan when page opens
  useEffect(() => {
    fetchSavedPlan();
  }, []);

  async function generatePlan() {
    try {
      setLoading(true);

      const userId = getUserId();

      if (!userId) {
        alert("Please login again.");
        return;
      }

      console.log("Generating planner for user:", userId);

      const result = await generateStudyPlan(userId);

      console.log("===== PLAN RECEIVED BY FRONTEND =====");
      console.log(result);

      setPlan(result);

      // Fetch the newly saved MongoDB tasks
      await fetchSavedPlan();
    } catch (error) {
      console.error("PLANNER ERROR:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Unable to generate study plan"
      );
    } finally {
      setLoading(false);
    }
  }

  // Mark a study task as completed
  async function completeTask(taskId) {
    try {
      const response = await API.post("/study-plan/complete", {
        taskId,
      });

      const updatedTask = response.data.task;

      // Update the task in frontend state
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        )
      );

      // Also update the timetable displayed on screen
      setPlan((previousPlan) => {
        if (!previousPlan) {
          return previousPlan;
        }

        return {
          ...previousPlan,
          timetable: previousPlan.timetable?.map((item) =>
            item._id === updatedTask._id ? updatedTask : item
          ),
        };
      });
    } catch (error) {
      console.error("ERROR COMPLETING TASK:", error);

      alert(
        error.response?.data?.message ||
          "Unable to mark task as complete."
      );
    }
  }

  // Calculate completion progress
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const completionPercentage =
    totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                <span>📅</span>
                Personalized Learning
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
                AI Study Planner
              </h1>

              <p className="mt-3 max-w-2xl text-slate-500">
                Generate a personalized study timetable based on
                your learning profile, goals, and performance.
              </p>

            </div>


            <Button
              onClick={generatePlan}
              disabled={loading}
              className="h-12 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-6 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {loading
                ? "🤖 Generating..."
                : "✨ Generate Study Plan"}
            </Button>

          </div>

        </div>

      </div>


      {/* Main content */}
      <main className="mx-auto max-w-7xl px-6 py-8 md:px-10">

        {/* Loading saved plan */}
        {loadingTasks && !plan && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">

            <div className="text-2xl">
              📚
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Loading your saved study plan...
            </p>

          </div>
        )}


        {/* Empty state */}
        {!loadingTasks && !plan && (
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-8 text-white shadow-xl md:p-12">

            <div className="grid items-center gap-8 md:grid-cols-2">

              <div>

                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                  📅
                </div>

                <h2 className="text-3xl font-extrabold md:text-4xl">
                  Build your personalized study plan.
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-white/80">
                  Let AI analyze your learning profile and create
                  a structured timetable designed around your goals.
                </p>

                <Button
                  onClick={generatePlan}
                  disabled={loading}
                  className="mt-7 rounded-xl bg-white px-6 py-3 font-semibold text-blue-600 shadow-lg hover:bg-white/90"
                >
                  {loading
                    ? "🤖 Generating..."
                    : "Generate My Plan →"}
                </Button>

              </div>


              <div className="hidden justify-center md:flex">

                <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">

                  <div className="rounded-3xl bg-white p-5 text-slate-800 shadow-xl">

                    <p className="text-xs font-semibold text-slate-400">
                      YOUR AI PLAN
                    </p>

                    <div className="mt-5 space-y-3">

                      <div className="rounded-xl bg-blue-50 p-4">
                        <p className="text-xs text-blue-500">
                          05:00 PM
                        </p>

                        <p className="mt-1 font-bold">
                          Data Structures
                        </p>
                      </div>

                      <div className="rounded-xl bg-emerald-50 p-4">
                        <p className="text-xs text-emerald-500">
                          06:30 PM
                        </p>

                        <p className="mt-1 font-bold">
                          Database Systems
                        </p>
                      </div>

                      <div className="rounded-xl bg-orange-50 p-4">
                        <p className="text-xs text-orange-500">
                          08:00 PM
                        </p>

                        <p className="mt-1 font-bold">
                          Practice Quiz
                        </p>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}


        {plan && (
          <div className="space-y-8">

            {/* Progress overview */}
            {totalTasks > 0 && (
              <div className="grid gap-6 md:grid-cols-3">

                {/* Completion */}
                <Card className="border-0 bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-white shadow-lg">
                  <CardContent className="p-6">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-white/70">
                          Plan Completion
                        </p>

                        <p className="mt-2 text-4xl font-extrabold">
                          {completionPercentage}%
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
                        📊
                      </div>

                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">

                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{
                          width: `${completionPercentage}%`,
                        }}
                      />

                    </div>

                    <p className="mt-3 text-sm text-white/70">
                      {completedTasks} of {totalTasks} tasks completed
                    </p>

                  </CardContent>
                </Card>


                {/* Total tasks */}
                <Card className="border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
                  <CardContent className="p-6">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Total Tasks
                        </p>

                        <p className="mt-2 text-4xl font-extrabold text-slate-800">
                          {totalTasks}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
                        📝
                      </div>

                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      Tasks generated for your learning schedule.
                    </p>

                  </CardContent>
                </Card>


                {/* Remaining */}
                <Card className="border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">
                  <CardContent className="p-6">

                    <div className="flex items-start justify-between">

                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          Remaining
                        </p>

                        <p className="mt-2 text-4xl font-extrabold text-slate-800">
                          {totalTasks - completedTasks}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-2xl">
                        🎯
                      </div>

                    </div>

                    <p className="mt-4 text-sm text-slate-500">
                      Keep going and complete your plan.
                    </p>

                  </CardContent>
                </Card>

              </div>
            )}


            {/* Timetable */}
            <Card className="overflow-hidden border-0 bg-white shadow-sm">

              <CardContent className="p-0">

                <div className="border-b border-slate-100 px-6 py-6 md:px-8">

                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">

                    <div>

                      <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                          📅
                        </div>

                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">
                            7-Day Study Timetable
                          </h2>

                          <p className="mt-1 text-sm text-slate-400">
                            Your personalized weekly schedule
                          </p>
                        </div>

                      </div>

                    </div>

                  </div>

                </div>


                <div className="overflow-x-auto">

                  <table className="w-full min-w-[950px] text-left">

                    <thead>

                      <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-400">

                        <th className="px-6 py-4 font-semibold">
                          Day
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Time
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Subject
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Topic
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Task
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Priority
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Status
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {plan.timetable?.map((item, index) => {

                        const savedTask = tasks.find(
                          (task) => task._id === item._id
                        );

                        const isCompleted =
                          savedTask?.completed ||
                          item.completed ||
                          false;

                        return (
                          <tr
                            key={item._id || index}
                            className={`border-b border-slate-100 transition hover:bg-slate-50 ${
                              isCompleted ? "bg-slate-50/70" : ""
                            }`}
                          >

                            <td className="px-6 py-5 font-bold text-slate-700">
                              {item.day}
                            </td>

                            <td className="px-6 py-5">

                              <span className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                                {item.time}
                              </span>

                            </td>

                            <td className="px-6 py-5 font-semibold text-slate-700">
                              {item.subject}
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-500">
                              {item.topic}
                            </td>

                            <td
                              className={`max-w-xs px-6 py-5 text-sm text-slate-600 ${
                                isCompleted
                                  ? "line-through opacity-60"
                                  : ""
                              }`}
                            >
                              {item.task}
                            </td>

                            <td className="px-6 py-5">

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  item.priority?.toLowerCase() === "high"
                                    ? "bg-red-50 text-red-600"
                                    : item.priority?.toLowerCase() === "medium"
                                    ? "bg-orange-50 text-orange-600"
                                    : "bg-emerald-50 text-emerald-600"
                                }`}
                              >
                                {item.priority}
                              </span>

                            </td>

                            <td className="px-6 py-5">

                              {isCompleted ? (
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                                  ✓ Completed
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    completeTask(item._id)
                                  }
                                  className="rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-xs font-semibold shadow-sm"
                                >
                                  Mark Complete
                                </Button>
                              )}

                            </td>

                          </tr>
                        );
                      })}

                    </tbody>

                  </table>

                </div>

              </CardContent>

            </Card>


            {/* AI insights */}
            <div className="grid gap-6 lg:grid-cols-2">

              {/* Priority topics */}
              <Card className="border-0 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm">

                <CardContent className="p-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-100 text-xl">
                      🎯
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Priority Topics
                      </h2>

                      <p className="text-xs text-slate-400">
                        Areas AI recommends focusing on
                      </p>
                    </div>

                  </div>


                  <div className="mt-6 space-y-3">

                    {plan.priorityTopics?.map(
                      (topic, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 rounded-xl bg-white/80 p-3"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                            {index + 1}
                          </span>

                          <span className="text-sm font-medium text-slate-600">
                            {topic}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </CardContent>

              </Card>


              {/* Topics to revise */}
              <Card className="border-0 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm">

                <CardContent className="p-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-xl">
                      🔄
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Topics to Revise
                      </h2>

                      <p className="text-xs text-slate-400">
                        Concepts that need another review
                      </p>
                    </div>

                  </div>


                  <div className="mt-6 space-y-3">

                    {plan.topicsToRevise?.map(
                      (topic, index) => (
                        <div
                          key={index}
                          className="rounded-xl bg-white/80 p-3 text-sm font-medium text-slate-600"
                        >
                          {topic}
                        </div>
                      )
                    )}

                  </div>

                </CardContent>

              </Card>


              {/* Practice */}
              <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">

                <CardContent className="p-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-xl">
                      📝
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Practice & Test Recommendations
                      </h2>

                      <p className="text-xs text-slate-400">
                        Suggested practice activities
                      </p>
                    </div>

                  </div>


                  <div className="mt-6 space-y-3">

                    {plan.practiceRecommendations?.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-xl bg-white/80 p-3"
                        >
                          <span className="text-blue-500">
                            ✓
                          </span>

                          <span className="text-sm font-medium text-slate-600">
                            {recommendation}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </CardContent>

              </Card>


              {/* Study tips */}
              <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">

                <CardContent className="p-7">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-xl">
                      💡
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-800">
                        Study Tips
                      </h2>

                      <p className="text-xs text-slate-400">
                        AI-powered suggestions for better learning
                      </p>
                    </div>

                  </div>


                  <div className="mt-6 space-y-3">

                    {plan.studyTips?.map(
                      (tip, index) => (
                        <div
                          key={index}
                          className="flex gap-3 rounded-xl bg-white/80 p-3"
                        >
                          <span className="text-emerald-500">
                            ✦
                          </span>

                          <span className="text-sm font-medium text-slate-600">
                            {tip}
                          </span>
                        </div>
                      )
                    )}

                  </div>

                </CardContent>

              </Card>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}