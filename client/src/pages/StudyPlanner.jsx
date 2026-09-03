import { useState } from "react";
import { generateStudyPlan } from "../utils/plannerAgent";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function StudyPlanner() {
  const profile =
    JSON.parse(localStorage.getItem("studentProfile")) || {};

  const [plan, setPlan] = useState([]);

  function generatePlan() {
    const result = generateStudyPlan(profile);
    setPlan(result);
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
            key={index}
            className="bg-slate-900 border-slate-800"
          >
            <CardContent className="p-5">

              <h2 className="text-xl font-bold text-white">
                {item.subject}
              </h2>

              <p className="text-slate-300 mt-2">
                {item.task}
              </p>

              <p className="text-indigo-400 mt-2">
                {item.priority}
              </p>

              <p className="text-slate-500">
                {item.time}
              </p>

              <Button className="mt-4 w-full">
                ✅ Mark Complete
              </Button>

            </CardContent>
          </Card>

        ))}

      </div>

    </div>
  );
}

export default StudyPlanner;