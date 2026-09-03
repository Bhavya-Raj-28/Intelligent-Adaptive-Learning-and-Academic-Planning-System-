import { useState } from "react";
import { generateStudyPlan } from "../utils/plannerAgent";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  async function generatePlan() {

    try {

      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("Please login again.");
        return;
      }

      console.log("Generating planner for user:", user.id);

      const result = await generateStudyPlan(user.id);

console.log("===== PLAN RECEIVED BY FRONTEND =====");
console.log(result);

      console.log("PLAN RECEIVED:", result);

      setPlan(result);

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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-3">
        📅 AI Study Planner
      </h1>

      <p className="text-slate-400 mb-8">
        Generate a personalized study timetable based on your learning profile.
      </p>

      <Button
        onClick={generatePlan}
        disabled={loading}
      >
        {loading ? "🤖 Generating..." : "Generate Study Plan"}
      </Button>


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

                    </tr>

                  </thead>

                  <tbody>

                    {plan.timetable?.map((item, index) => (

                      <tr
                        key={index}
                        className="border-b border-slate-800"
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

                        <td className="p-4">
                          {item.task}
                        </td>

                        <td className="p-4">
                          {item.priority}
                        </td>

                      </tr>

                    ))}

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

                {plan.priorityTopics?.map((topic, index) => (
                  <li key={index}>
                    {topic}
                  </li>
                ))}

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

                {plan.topicsToRevise?.map((topic, index) => (
                  <li key={index}>
                    {topic}
                  </li>
                ))}

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

                {plan.studyTips?.map((tip, index) => (
                  <li key={index}>
                    {tip}
                  </li>
                ))}

              </ul>

            </CardContent>

          </Card>

        </div>

      )}

    </div>
  );
}