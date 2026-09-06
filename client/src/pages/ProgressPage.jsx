import { useEffect, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user || !user.id) {
          console.error(
            "User information not found."
          );
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/progress/${user.id}`
        );

        if (!response.ok) {
          throw new Error(
            "Failed to fetch progress"
          );
        }

        const data = await response.json();

        console.log("Progress data:", data);

        setProgress(data);
      } catch (error) {
        console.error(
          "Error fetching progress:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="border-b border-slate-200 bg-white">

          <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-2xl text-white shadow-md">
                📊
              </div>

              <div>
                <h1 className="text-3xl font-extrabold text-slate-800">
                  Progress Dashboard
                </h1>

                <p className="mt-1 text-slate-400">
                  Loading your learning analytics...
                </p>
              </div>

            </div>

          </div>

        </div>


        <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">

          <div className="grid gap-6 md:grid-cols-3">

            {[1, 2, 3].map((item) => (
              <Card
                key={item}
                className="border-0 bg-white shadow-sm"
              >
                <CardContent className="p-6">

                  <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

                  <div className="mt-5 h-10 w-20 animate-pulse rounded bg-slate-100" />

                </CardContent>
              </Card>
            ))}

          </div>

        </main>

      </div>
    );
  }

  const attempts = progress?.attempts || [];
  const subjects =
    progress?.subjectPerformance || [];
  const topics =
    progress?.topicPerformance || [];

  // Performance Insight
  let performanceMessage = "";

  if (
    !progress ||
    progress.totalQuizzes === 0
  ) {
    performanceMessage =
      "Complete your first quiz to start tracking your learning progress.";
  } else if (progress.averageScore >= 80) {
    performanceMessage =
      "Excellent performance! You are showing strong understanding. Keep practicing to maintain your progress.";
  } else if (progress.averageScore >= 60) {
    performanceMessage =
      "Good progress! You have a solid foundation. Focus on improving the questions you got wrong.";
  } else {
    performanceMessage =
      "You need more practice. Review the concepts from your recent quizzes and try another quiz.";
  }

  // Personalized Recommendation
  let recommendation = "";

  if (attempts.length === 0) {
    recommendation =
      "Take your first quiz to start building your personalized learning profile.";
  } else if (
    progress.weakArea &&
    topics.length > 0
  ) {
    const weakestTopic = topics.reduce(
      (weakest, current) =>
        current.averageScore <
        weakest.averageScore
          ? current
          : weakest
    );

    recommendation =
      `Focus on ${progress.weakArea.subject}, especially ${weakestTopic.topic}. Your current average in this area is ${weakestTopic.averageScore}%. Review this topic and take another quiz to measure your improvement.`;
  } else if (progress.weakArea) {
    recommendation =
      `Focus on ${progress.weakArea.subject}. Your current average in this subject is ${progress.weakArea.averageScore}%. Review the concepts and take another quiz to improve your understanding.`;
  } else {
    recommendation =
      "Keep practicing regularly to improve and maintain your learning progress.";
  }

  const averageScore =
    progress?.averageScore || 0;

  const bestScore =
    progress?.bestScore || 0;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div className="flex items-center gap-4">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 text-2xl text-white shadow-md">
                📊
              </div>

              <div>

                <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                  Learning Analytics
                </div>

                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-800 md:text-4xl">
                  Progress Dashboard
                </h1>

                <p className="mt-1 text-slate-500">
                  Understand your performance and keep improving.
                </p>

              </div>

            </div>


            <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-emerald-50 px-5 py-4">

              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Overall Performance
              </p>

              <p className="mt-1 text-2xl font-extrabold text-slate-800">
                {averageScore}%
              </p>

            </div>

          </div>

        </div>

      </div>


      <main className="mx-auto max-w-7xl px-6 py-10 md:px-10">

        {/* SUMMARY CARDS */}
        <div className="grid gap-6 md:grid-cols-3">

          {/* Quizzes */}
          <Card className="overflow-hidden border-0 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-400">
                    Quizzes Completed
                  </p>

                  <p className="mt-3 text-4xl font-extrabold text-slate-800">
                    {progress?.totalQuizzes || 0}
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                  📝
                </div>

              </div>

              <div className="mt-5 h-1.5 rounded-full bg-emerald-50">

                <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />

              </div>

            </CardContent>

          </Card>


          {/* Average */}
          <Card className="overflow-hidden border-0 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-400">
                    Average Score
                  </p>

                  <p className="mt-3 text-4xl font-extrabold text-slate-800">
                    {averageScore}%
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                  📈
                </div>

              </div>

              <div className="mt-5 h-1.5 rounded-full bg-blue-50">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all"
                  style={{
                    width: `${Math.min(
                      averageScore,
                      100
                    )}%`,
                  }}
                />

              </div>

            </CardContent>

          </Card>


          {/* Best */}
          <Card className="overflow-hidden border-0 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">

            <CardContent className="p-6">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-400">
                    Best Score
                  </p>

                  <p className="mt-3 text-4xl font-extrabold text-slate-800">
                    {bestScore}%
                  </p>

                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-xl">
                  🏆
                </div>

              </div>

              <div className="mt-5 h-1.5 rounded-full bg-amber-50">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-400 to-amber-300 transition-all"
                  style={{
                    width: `${Math.min(
                      bestScore,
                      100
                    )}%`,
                  }}
                />

              </div>

            </CardContent>

          </Card>

        </div>


        {/* PERFORMANCE INSIGHT */}
        <Card className="mt-8 overflow-hidden border-0 shadow-sm">

          <CardContent className="p-0">

            <div className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 p-7 text-white">

              <div className="flex items-start gap-5">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-xl backdrop-blur-sm">
                  🧠
                </div>

                <div>

                  <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                    Performance Insight
                  </p>

                  <p className="mt-2 text-lg font-medium leading-7 text-white/95">
                    {performanceMessage}
                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>


        {/* WEAK + STRONG */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Weak Area */}
          <Card className="border-0 bg-white shadow-sm">

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-xl">
                    ⚠️
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-800">
                      Weak Area
                    </h2>

                    <p className="text-sm text-slate-400">
                      Focus here next
                    </p>

                  </div>

                </div>

                {progress?.weakArea && (
                  <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-500">
                    Needs Practice
                  </span>
                )}

              </div>


              {progress?.weakArea ? (
                <div className="mt-7">

                  <p className="text-2xl font-extrabold text-slate-800">
                    {progress.weakArea.subject}
                  </p>

                  <div className="mt-4 flex items-end justify-between">

                    <p className="text-3xl font-extrabold text-red-500">
                      {progress.weakArea.averageScore}%
                    </p>

                    <p className="text-sm text-slate-400">
                      Current average
                    </p>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-red-50">

                    <div
                      className="h-full rounded-full bg-red-400"
                      style={{
                        width: `${Math.min(
                          progress.weakArea
                            .averageScore,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Review this subject regularly and
                    use adaptive quizzes to improve.
                  </p>

                </div>
              ) : (
                <div className="mt-7 rounded-2xl bg-slate-50 p-5">

                  <p className="text-sm leading-6 text-slate-500">
                    Complete more quizzes to identify
                    your weak areas.
                  </p>

                </div>
              )}

            </CardContent>

          </Card>


          {/* Strong Area */}
          <Card className="border-0 bg-white shadow-sm">

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                    💪
                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-800">
                      Strong Area
                    </h2>

                    <p className="text-sm text-slate-400">
                      Keep building on it
                    </p>

                  </div>

                </div>

                {progress?.strongArea && (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Great Work
                  </span>
                )}

              </div>


              {progress?.strongArea ? (
                <div className="mt-7">

                  <p className="text-2xl font-extrabold text-slate-800">
                    {progress.strongArea.subject}
                  </p>

                  <div className="mt-4 flex items-end justify-between">

                    <p className="text-3xl font-extrabold text-emerald-500">
                      {progress.strongArea.averageScore}%
                    </p>

                    <p className="text-sm text-slate-400">
                      Current average
                    </p>

                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-emerald-50">

                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                      style={{
                        width: `${Math.min(
                          progress.strongArea
                            .averageScore,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-500">
                    Great understanding! Keep
                    practicing to maintain this level.
                  </p>

                </div>
              ) : (
                <div className="mt-7 rounded-2xl bg-slate-50 p-5">

                  <p className="text-sm leading-6 text-slate-500">
                    Complete more quizzes to identify
                    your strongest areas.
                  </p>

                </div>
              )}

            </CardContent>

          </Card>

        </div>


        {/* SUBJECT PERFORMANCE */}
        <Card className="mt-8 border-0 bg-white shadow-sm">

          <CardContent className="p-7 md:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                📚
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Subject Performance
                </h2>

                <p className="text-sm text-slate-400">
                  See how you're performing across subjects.
                </p>

              </div>

            </div>


            {subjects.length === 0 ? (
              <div className="mt-7 rounded-2xl bg-slate-50 p-6">

                <p className="text-slate-500">
                  Complete quizzes to see subject performance.
                </p>

              </div>
            ) : (
              <div className="mt-8 space-y-6">

                {subjects.map(
                  (subject, index) => (
                    <div key={index}>

                      <div className="mb-2 flex items-center justify-between">

                        <span className="font-semibold text-slate-700">
                          {subject.subject}
                        </span>

                        <span className="font-bold text-slate-800">
                          {subject.averageScore}%
                        </span>

                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-500"
                          style={{
                            width: `${Math.min(
                              subject.averageScore,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>
                  )
                )}

              </div>
            )}

          </CardContent>

        </Card>


        {/* TOPIC PERFORMANCE */}
        <Card className="mt-8 border-0 bg-white shadow-sm">

          <CardContent className="p-7 md:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-xl">
                🎯
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Topic Performance
                </h2>

                <p className="text-sm text-slate-400">
                  Identify topics that need more attention.
                </p>

              </div>

            </div>


            {topics.length === 0 ? (
              <div className="mt-7 rounded-2xl bg-slate-50 p-6">

                <p className="text-slate-500">
                  Complete quizzes to see topic performance.
                </p>

              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2">

                {topics.map(
                  (topic, index) => (

                    <div
                      key={index}
                      className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-sm"
                    >

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <p className="font-bold text-slate-700">
                            {topic.topic}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {topic.attempts} quiz
                            {topic.attempts !== 1
                              ? "zes"
                              : ""}
                          </p>

                        </div>

                        <div className="rounded-xl bg-white px-3 py-2 shadow-sm">

                          <p className="text-xl font-extrabold text-purple-600">
                            {topic.averageScore}%
                          </p>

                        </div>

                      </div>

                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">

                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400"
                          style={{
                            width: `${Math.min(
                              topic.averageScore,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                  )
                )}

              </div>
            )}

          </CardContent>

        </Card>


        {/* WHAT TO DO NEXT */}
        <Card className="mt-8 overflow-hidden border-0 shadow-sm">

          <CardContent className="p-0">

            <div className="bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 p-7 text-white md:p-8">

              <div className="flex flex-col gap-6 md:flex-row md:items-center">

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                  🎯
                </div>

                <div>

                  <p className="text-sm font-semibold uppercase tracking-wider text-white/70">
                    Personalized Recommendation
                  </p>

                  <h2 className="mt-1 text-2xl font-extrabold">
                    What To Do Next?
                  </h2>

                  <p className="mt-3 max-w-4xl leading-7 text-white/85">
                    {recommendation}
                  </p>

                </div>

              </div>

            </div>

          </CardContent>

        </Card>


        {/* SCORE TREND */}
        <Card className="mt-8 border-0 bg-white shadow-sm">

          <CardContent className="p-7 md:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-xl">
                📈
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Score Trend
                </h2>

                <p className="text-sm text-slate-400">
                  Track how your quiz scores are changing.
                </p>

              </div>

            </div>


            {attempts.length === 0 ? (
              <div className="mt-7 rounded-2xl bg-slate-50 p-6">

                <p className="text-slate-500">
                  Complete quizzes to see your score trend.
                </p>

              </div>
            ) : (
              <div className="mt-8 space-y-5">

                {[...attempts]
                  .reverse()
                  .map(
                    (attempt, index) => (

                      <div key={attempt._id || index}>

                        <div className="mb-2 flex justify-between">

                          <span className="text-sm font-medium text-slate-500">
                            Quiz {index + 1}
                          </span>

                          <span className="text-sm font-bold text-slate-800">
                            {attempt.percentage}%
                          </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">

                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                            style={{
                              width: `${Math.min(
                                attempt.percentage,
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>

                    )
                  )}

              </div>
            )}

          </CardContent>

        </Card>


        {/* RECENT QUIZ HISTORY */}
        <Card className="mt-8 border-0 bg-white shadow-sm">

          <CardContent className="p-7 md:p-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                📚
              </div>

              <div>

                <h2 className="text-2xl font-bold text-slate-800">
                  Recent Quiz History
                </h2>

                <p className="text-sm text-slate-400">
                  Review your previous quiz attempts.
                </p>

              </div>

            </div>


            {attempts.length === 0 ? (
              <div className="mt-7 rounded-2xl bg-slate-50 p-6">

                <p className="text-slate-500">
                  No quizzes completed yet.
                </p>

              </div>
            ) : (
              <div className="mt-8 space-y-4">

                {attempts.map(
                  (attempt, index) => (

                    <div
                      key={
                        attempt._id || index
                      }
                      className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 transition duration-200 hover:bg-white hover:shadow-sm md:flex-row md:items-center md:justify-between"
                    >

                      <div>

                        <h3 className="text-lg font-bold text-slate-800">
                          {attempt.topic ||
                            "General Quiz"}
                        </h3>

                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {attempt.subject ||
                            "General"}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {new Date(
                            attempt.completedAt
                          ).toLocaleDateString()}
                        </p>

                      </div>


                      <div className="rounded-2xl bg-white px-5 py-3 text-left shadow-sm md:text-right">

                        <p className="text-2xl font-extrabold text-blue-600">
                          {attempt.percentage}%
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {attempt.score} /{" "}
                          {attempt.totalQuestions}{" "}
                          correct
                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>
            )}

          </CardContent>

        </Card>

      </main>

    </div>
  );
}