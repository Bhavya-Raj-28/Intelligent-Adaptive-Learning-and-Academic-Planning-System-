import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../services/api";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const navigate = useNavigate();

  const [student, setStudent] = useState({
    name: "",
    email: "",
    department: "",
    semester: "",
    goal: "",
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const storedUser = localStorage.getItem("user");

        if (!storedUser) {
          navigate("/login");
          return;
        }

        const user = JSON.parse(storedUser);

        // Get the latest student profile from MongoDB
        const response = await API.get(`/profile/${user.id}`);

        const profile = response.data.profile;

        setStudent({
          name: user.name || "",
          email: user.email || "",
          department: profile.department || "",
          semester: profile.semester || "",
          goal: profile.goal || "",
        });

      } catch (error) {
        console.error("DASHBOARD PROFILE ERROR:", error);

        // If the student does not have a profile yet
        if (error.response?.status === 404) {
          const storedUser = localStorage.getItem("user");

          if (storedUser) {
            const user = JSON.parse(storedUser);

            setStudent({
              name: user.name || "",
              email: user.email || "",
              department: "",
              semester: "",
              goal: "",
            });
          }
        }
      }
    }

    loadDashboard();
  }, [navigate]);

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* =====================================================
          SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 hidden h-screen w-56 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl md:flex md:flex-col">

        {/* Logo */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg shadow-lg">
              🎓
            </div>

            <div>
              <h1 className="text-sm font-bold tracking-wide">
                AI Learning
              </h1>

              <p className="text-xs text-slate-400">
                System
              </p>
            </div>

          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">

          <button
            onClick={() => navigate("/dashboard")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl bg-gradient-to-r from-blue-500/25 to-cyan-400/20 px-4 py-3 text-left text-sm font-semibold text-cyan-300 shadow-sm transition hover:from-blue-500/35 hover:to-cyan-400/30"
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            onClick={() => navigate("/ai-tutor")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span>🤖</span>
            AI Tutor
          </button>

          <button
            onClick={() => navigate("/planner")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span>▣</span>
            Study Planner
          </button>

          <button
            onClick={() => navigate("/quiz")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span>◉</span>
            Adaptive Quiz
          </button>

          <button
            onClick={() => navigate("/progress")}
            className="mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <span>▥</span>
            Progress
          </button>

        </nav>

        {/* Bottom */}
        <div className="px-4 pb-6">

          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <span>⚙</span>
            Settings
          </button>

        </div>

      </aside>


      {/* =====================================================
          MOBILE TOP BAR
      ====================================================== */}

      <div className="flex items-center justify-between bg-slate-900 px-5 py-4 text-white md:hidden">

        <div className="flex items-center gap-2">

          <span className="text-xl">
            🎓
          </span>

          <span className="font-bold">
            AI Learning System
          </span>

        </div>

        <Button
          onClick={logout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm hover:bg-red-600"
        >
          Logout
        </Button>

      </div>


      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <main className="min-h-screen md:ml-56">


        {/* =================================================
            GRADIENT HERO HEADER
        ================================================== */}

        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-6 py-8 text-white shadow-md md:px-10">

          {/* Decorative shapes */}

          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

          <div className="absolute right-1/3 bottom-[-80px] h-48 w-48 rounded-full bg-blue-300/20 blur-3xl" />


          <div className="relative flex items-center justify-between">

            <div>

              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                Welcome, {student.name || "Student"} 👋
              </h1>

              <p className="mt-1 text-sm text-white/80">
                {student.email}
              </p>

            </div>


            {/* Motivational header text */}

            <div className="hidden text-right md:block">

              <p className="text-lg font-bold leading-tight">
                Best way Forward
                <br />
                Is
                <br />
                Through
                <br />
              </p>

            </div>


            {/* Logout */}

            <Button
              onClick={logout}
              className="ml-6 hidden rounded-lg border border-white/30 bg-white/10 px-5 text-white backdrop-blur-sm hover:bg-white/20 md:block"
            >
              Logout
            </Button>

          </div>

        </section>


        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="px-6 py-8 md:px-10 md:py-10">

          {/* Dashboard heading */}

          <div className="mb-5">

            <h2 className="text-xl font-bold text-slate-800">
              Your AI Learning Dashboard
            </h2>

          </div>


          {/* =================================================
              FEATURE CARDS
          ================================================== */}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">


            {/* AI TUTOR */}

            <Card className="group overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-cyan-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <CardContent className="p-5">

                <div className="mb-4 flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-xl shadow-md">
                    🤖
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white/70 text-lg text-emerald-600 shadow-sm transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  AI Tutor
                </h3>

                <p className="mt-2 min-h-[42px] text-sm leading-5 text-slate-500">
                  Ask doubts and get instant explanations.
                </p>

                <Button
                  onClick={() => navigate("/ai-tutor")}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-sm hover:from-emerald-600 hover:to-cyan-600"
                >
                  Open →
                </Button>

              </CardContent>

            </Card>


            {/* STUDY PLANNER */}

            <Card className="group overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-100 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <CardContent className="p-5">

                <div className="mb-4 flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-xl shadow-md">
                    📅
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white/70 text-lg text-blue-600 shadow-sm transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  Study Planner
                </h3>

                <p className="mt-2 min-h-[42px] text-sm leading-5 text-slate-500">
                  Generate personalized study schedules.
                </p>

                <Button
                  onClick={() => navigate("/planner")}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-sm hover:from-blue-600 hover:to-cyan-600"
                >
                  Generate →
                </Button>

              </CardContent>

            </Card>


            {/* ADAPTIVE QUIZ */}

            <Card className="group overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <CardContent className="p-5">

                <div className="mb-4 flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-400 text-xl shadow-md">
                    📝
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white/70 text-lg text-orange-500 shadow-sm transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  Adaptive Quiz
                </h3>

                <p className="mt-2 min-h-[42px] text-sm leading-5 text-slate-500">
                  Practice with AI-generated quizzes.
                </p>

                <Button
                  onClick={() => navigate("/quiz")}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-sm hover:from-orange-500 hover:to-amber-600"
                >
                  Start →
                </Button>

              </CardContent>

            </Card>


            {/* PROGRESS */}

            <Card className="group overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

              <CardContent className="p-5">

                <div className="mb-4 flex items-start justify-between">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 text-xl shadow-md">
                    📊
                  </div>

                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white bg-white/70 text-lg text-purple-600 shadow-sm transition group-hover:translate-x-1">
                    →
                  </span>

                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  Progress
                </h3>

                <p className="mt-2 min-h-[42px] text-sm leading-5 text-slate-500">
                  View your learning analytics.
                </p>

                <Button
                  onClick={() => navigate("/progress")}
                  className="mt-4 w-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm hover:from-purple-600 hover:to-indigo-600"
                >
                  View →
                </Button>

              </CardContent>

            </Card>

          </div>


          {/* =================================================
              CURRENT GOAL
          ================================================== */}

          <Card className="mt-6 overflow-hidden rounded-2xl border-0 bg-gradient-to-r from-blue-100 via-cyan-50 to-emerald-100 shadow-sm">

            <CardContent className="relative p-6">

              <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 text-5xl opacity-60 md:block">
                🎯
              </div>

              <div className="relative max-w-2xl">

                <div className="mb-2 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm">
                    🎯
                  </div>

                  <h2 className="text-lg font-bold text-slate-800">
                    Current Goal
                  </h2>

                </div>

                <p className="text-base font-semibold text-slate-700">
                  {student.goal
                    ? student.goal
                    : "Complete your profile to set your learning goal."}
                </p>

              </div>

            </CardContent>

          </Card>


          {/* Small motivational text */}

          <p className="mt-6 text-center text-sm text-slate-400">
            Small steps every day lead to big results ✨
          </p>

        </div>

      </main>

    </div>
  );
}