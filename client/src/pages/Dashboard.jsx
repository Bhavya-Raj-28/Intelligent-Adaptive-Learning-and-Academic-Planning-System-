import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    department: "",
    semester: "",
    goal: "",
  });

 useEffect(() => {
  const user = localStorage.getItem("user");

  if (!user) {
    navigate("/login");
    return;
  }

  setStudent(JSON.parse(user));
}, [navigate]);

  function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  navigate("/login");
}

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <div className="flex justify-between items-center px-10 py-6 border-b border-slate-800">

        <div>
          <h1 className="text-3xl font-bold">
            Welcome, {student.name || "Student"} 👋
          </h1>

          <p className="text-slate-400 mt-1">
  {student.email}
</p>
        </div>

        <Button
          variant="destructive"
          onClick={logout}
        >
          Logout
        </Button>

      </div>

      {/* Main Content */}
      <div className="p-10">

        <h2 className="text-2xl font-semibold mb-6">
          Your AI Learning Dashboard
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500 transition">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                🤖 AI Tutor
              </h3>

              <p className="text-slate-400">
                Ask doubts and get instant explanations.
              </p>

              <Button
  className="mt-5 w-full"
  onClick={() => navigate("/ai-tutor")}
>
  Open
</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500 transition">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                📅 Study Planner
              </h3>

              <p className="text-slate-400">
                Generate personalized study schedules.
              </p>

              <Button
  className="mt-5 w-full"
  onClick={() => navigate("/planner")}
>
  Generate
</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500 transition">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                📝 Adaptive Quiz
              </h3>

              <p className="text-slate-400">
                Practice with AI-generated quizzes.
              </p>

              <Button
  className="mt-5 w-full"
  onClick={() => navigate("/quiz")}
>
  Start
</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800 hover:border-indigo-500 transition">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-white mb-3">
                📊 Progress
              </h3>

              <p className="text-slate-400">
                View your learning analytics.
              </p>

              <Button
  className="mt-5 w-full"
  onClick={() => navigate("/progress")}
>
  View
</Button>
            </CardContent>
          </Card>

        </div>

        {/* Goal Card */}
        <Card className="mt-8 bg-slate-900 border-slate-800">
          <CardContent className="p-6">

            <h2 className="text-xl font-bold text-white mb-3">
              🎯 Current Goal
            </h2>

            <p className="text-xl font-bold text-white mb-3">
              Complete your profile to set your learning goal.
            </p>

          </CardContent>
        </Card>

      </div>

    </div>
  );
}