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

      const response = await API.get(
        `/study-plan/${userId}`
      );

      const savedTasks = response.data.tasks || [];

      console.log(
        "===== SAVED STUDY PLAN ====="
      );
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
      console.error(
        "ERROR FETCHING SAVED STUDY PLAN:",
        error
      );
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

      console.log(
        "Generating planner for user:",
        userId
      );

      const result = await generateStudyPlan(userId);

      console.log(
        "===== PLAN RECEIVED BY FRONTEND ====="
      );
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
      const response = await API.post(
        "/study-plan/complete",
        {
          taskId,
        }
      );

      const updatedTask = response.data.task;

      // Update the task in frontend state
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === updatedTask._id
            ? updatedTask
            : task
        )
      );

      // Also update the timetable displayed on screen
      setPlan((previousPlan) => {
        if (!previousPlan) {
          return previousPlan;
        }

        return {
          ...previousPlan,
          timetable: previousPlan.timetable?.map(
            (item) =>
              item._id === updatedTask._id
                ? updatedTask
                : item
          ),
        };
      });
    } catch (error) {
      console.error(
        "ERROR COMPLETING TASK:",
        error
      );

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
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-3">
        📅 AI Study Planner
      </h1>

      <p className="text-slate-400 mb-8">
        Generate a personalized study timetable based
        on your learning profile.
      </p>

      <Button
        onClick={generatePlan}
        disabled={loading}
      >
        {loading
          ? "🤖 Generating..."
          : "Generate Study Plan"}
      </Button>

      {/* PROGRESS */}
      {totalTasks > 0 && (
        <Card className="bg-slate-900 border-slate-800 mt-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-3">
              📊 Study Plan Progress
            </h2>

            <p className="text-slate-300 mb-4">
              {completedTasks} / {totalTasks} tasks
              completed
            </p>

            <div className="w-full bg-slate-800 rounded-full h-4">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>

            <p className="text-green-400 mt-3 font-semibold">
              {completionPercentage}% Complete
            </p>
          </CardContent>
        </Card>
      )}

      {loadingTasks && !plan && (
        <p className="text-slate-400 mt-8">
          Loading saved study plan...
        </p>
      )}

      {plan && (
        <div className="mt-10 space-y-8">

          {/* TIMETABLE */}

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">

              <h2 className="text-2xl font-bold mb-6">
                📅 7-Day Study Timetable
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full text-left border-collapse">

                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="p-4">Day</th>
                      <th className="p-4">Time</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Topic</th>
                      <th className="p-4">Task</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {plan.timetable?.map(
                      (item, index) => {

                        const savedTask =
                          tasks.find(
                            (task) =>
                              task._id === item._id
                          );

                        const isCompleted =
                          savedTask?.completed ||
                          item.completed ||
                          false;

                        return (
                          <tr
                            key={
                              item._id || index
                            }
                            className={`border-b border-slate-800 ${
                              isCompleted
                                ? "opacity-60"
                                : ""
                            }`}
                          >

                            <td className="p-4 font-semibold">
                              {item.day}
                            </td>

                            <td className="p-4">
                              {item.time}
                            </td>

                            <td className="p-4 font-semibold">
                              {item.subject}
                            </td>

                            <td className="p-4">
                              {item.topic}
                            </td>

                            <td
                              className={`p-4 ${
                                isCompleted
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {item.task}
                            </td>

                            <td className="p-4">
                              {item.priority}
                            </td>

                            <td className="p-4">
                              {isCompleted ? (
                                <span className="text-green-400 font-semibold">
                                  ✓ Completed
                                </span>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    completeTask(
                                      item._id
                                    )
                                  }
                                >
                                  Mark Complete
                                </Button>
                              )}
                            </td>

                          </tr>
                        );
                      }
                    )}
                  </tbody>

                </table>

              </div>

            </CardContent>
          </Card>

          {/* PRIORITY TOPICS */}

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">

              <h2 className="text-2xl font-bold mb-4">
                🎯 Priority Topics
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-slate-300">

                {plan.priorityTopics?.map(
                  (topic, index) => (
                    <li key={index}>
                      {topic}
                    </li>
                  )
                )}

              </ul>

            </CardContent>
          </Card>

          {/* TOPICS TO REVISE */}

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">

              <h2 className="text-2xl font-bold mb-4">
                🔄 Topics to Revise
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-slate-300">

                {plan.topicsToRevise?.map(
                  (topic, index) => (
                    <li key={index}>
                      {topic}
                    </li>
                  )
                )}

              </ul>

            </CardContent>
          </Card>

          {/* PRACTICE */}

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">

              <h2 className="text-2xl font-bold mb-4">
                📝 Practice & Test Recommendations
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-slate-300">

                {plan.practiceRecommendations?.map(
                  (recommendation, index) => (
                    <li key={index}>
                      {recommendation}
                    </li>
                  )
                )}

              </ul>

            </CardContent>
          </Card>

          {/* STUDY TIPS */}

          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-6">

              <h2 className="text-2xl font-bold mb-4">
                💡 Study Tips
              </h2>

              <ul className="list-disc pl-6 space-y-2 text-slate-300">

                {plan.studyTips?.map(
                  (tip, index) => (
                    <li key={index}>
                      {tip}
                    </li>
                  )
                )}

              </ul>

            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}