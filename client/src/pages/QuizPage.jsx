import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import API from "../services/api";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  const [quizSubject, setQuizSubject] = useState("");
  const [quizTopic, setQuizTopic] = useState("");

  async function generateQuiz() {
    try {
      setLoading(true);
      setScore(null);
      setSelected({});

      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("Please login again.");
        setLoading(false);
        return;
      }

      console.log("===== REQUESTING QUIZ =====");

      const res = await API.post("/quiz/generate", {
        userId: user.id,
      });

      console.log("QUIZ RESPONSE:", res.data);

      const generatedQuiz = res.data.quiz;

      const generatedQuestions =
        generatedQuiz?.questions || [];

      setQuizSubject(
        generatedQuiz?.subject || "General"
      );

      setQuizTopic(
        generatedQuiz?.topic || "General"
      );

      setQuestions(generatedQuestions);
      setLoading(false);
    } catch (err) {
      console.error("QUIZ ERROR:", err);

      const message =
        err.response?.data?.message ||
        "Unable to generate quiz";

      alert(message);

      setLoading(false);
    }
  }

  function handleSelect(questionIndex, option) {
    setSelected({
      ...selected,
      [questionIndex]: option,
    });
  }

  async function submitQuiz() {
    let correct = 0;

    questions.forEach((question, index) => {
      if (selected[index] === question.answer) {
        correct++;
      }
    });

    // Keep showing the score immediately
    setScore(correct);

    // Save quiz result to backend
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
        "http://localhost:5000/api/quiz/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            subject: quizSubject,
            topic: quizTopic,
            score: correct,
            totalQuestions: questions.length,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to save quiz result"
        );
      }

      console.log(
        "Quiz result saved successfully."
      );
    } catch (error) {
      console.error(
        "Error saving quiz result:",
        error
      );
    }
  }

  const percentage =
    questions.length > 0 && score !== null
      ? Math.round(
          (score / questions.length) * 100
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

            <div>

              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
                <span>📝</span>
                Adaptive Learning
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
                Adaptive Quiz
              </h1>

              <p className="mt-3 max-w-2xl text-slate-500">
                Test your knowledge with AI-generated questions
                adapted to your learning performance.
              </p>

            </div>


            {questions.length === 0 && !loading && (
              <Button
                onClick={generateQuiz}
                className="h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 font-semibold text-white shadow-md transition duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                ✨ Generate Quiz
              </Button>
            )}

          </div>

        </div>

      </div>


      <main className="mx-auto max-w-5xl px-6 py-8 md:px-10">

        {/* Loading */}
        {loading && (
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300 p-8 text-white shadow-xl md:p-12">

            <div className="flex flex-col items-center justify-center text-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-4xl backdrop-blur-sm">
                🤖
              </div>

              <h2 className="mt-6 text-3xl font-extrabold">
                Preparing your quiz...
              </h2>

              <p className="mt-3 max-w-lg text-white/80">
                AI is generating questions based on your
                learning performance and weak areas.
              </p>

              <div className="mt-7 h-2 w-48 overflow-hidden rounded-full bg-white/20">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-white" />
              </div>

            </div>

          </div>
        )}


        {/* Empty state */}
        {!loading && questions.length === 0 && (
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300 p-8 text-white shadow-xl md:p-12">

            <div className="grid items-center gap-10 md:grid-cols-2">

              <div>

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                  📝
                </div>

                <h2 className="mt-6 text-3xl font-extrabold md:text-4xl">
                  Ready to test yourself?
                </h2>

                <p className="mt-4 max-w-xl leading-7 text-white/80">
                  Generate a personalized quiz and challenge
                  yourself with questions selected according
                  to your learning needs.
                </p>

                <Button
                  onClick={generateQuiz}
                  className="mt-7 rounded-xl bg-white px-6 py-3 font-semibold text-orange-600 shadow-lg hover:bg-white/90"
                >
                  Start Adaptive Quiz →
                </Button>

              </div>


              <div className="hidden justify-center md:flex">

                <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md">

                  <div className="rounded-3xl bg-white p-5 text-slate-800 shadow-xl">

                    <div className="flex items-center justify-between">

                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          AI QUIZ
                        </p>

                        <p className="mt-1 font-bold">
                          Test your knowledge
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-xl">
                        📝
                      </div>

                    </div>

                    <div className="mt-6 space-y-3">

                      <div className="rounded-xl bg-orange-50 p-3 text-sm font-medium">
                        Question 01
                      </div>

                      <div className="rounded-xl border border-slate-100 p-3 text-sm text-slate-400">
                        Choose the correct answer
                      </div>

                      <div className="rounded-xl border border-slate-100 p-3 text-sm text-slate-400">
                        Select your option
                      </div>

                      <div className="rounded-xl border border-slate-100 p-3 text-sm text-slate-400">
                        Submit your answer
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* Quiz */}
        {!loading && questions.length > 0 && score === null && (

          <div className="space-y-6">

            {/* Quiz info */}
            <Card className="border-0 bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 shadow-sm">

              <CardContent className="p-6">

                <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                      Current Quiz
                    </p>

                    <h2 className="mt-2 text-2xl font-extrabold text-slate-800">
                      {quizSubject}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Topic: {quizTopic}
                    </p>

                  </div>


                  <div className="flex items-center gap-3">

                    <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">

                      <p className="text-xs text-slate-400">
                        Questions
                      </p>

                      <p className="text-xl font-bold text-slate-800">
                        {questions.length}
                      </p>

                    </div>

                    <div className="rounded-xl bg-white px-4 py-3 text-center shadow-sm">

                      <p className="text-xs text-slate-400">
                        Mode
                      </p>

                      <p className="text-xl font-bold text-orange-500">
                        AI
                      </p>

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>


            {/* Questions */}
            {questions.map((question, index) => (

              <Card
                key={index}
                className="border-0 bg-white shadow-sm"
              >

                <CardContent className="p-6 md:p-8">

                  <div className="flex items-start gap-4">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-sm font-bold text-orange-600">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1">

                      <h2 className="text-lg font-bold leading-7 text-slate-800 md:text-xl">
                        {question.question}
                      </h2>

                      {question.difficulty && (
                        <span
                          className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            question.difficulty.toLowerCase() === "hard"
                              ? "bg-red-50 text-red-600"
                              : question.difficulty.toLowerCase() === "medium"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {question.difficulty}
                        </span>
                      )}

                    </div>

                  </div>


                  <div className="mt-6 space-y-3">

                    {question.options.map(
                      (option, optionIndex) => {

                        const isSelected =
                          selected[index] === option;

                        return (
                          <label
                            key={optionIndex}
                            className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition duration-200 ${
                              isSelected
                                ? "border-orange-400 bg-orange-50 shadow-sm"
                                : "border-slate-200 bg-white hover:border-orange-200 hover:bg-orange-50/40"
                            }`}
                          >

                            <input
                              type="radio"
                              name={`question-${index}`}
                              value={option}
                              checked={isSelected}
                              onChange={() =>
                                handleSelect(
                                  index,
                                  option
                                )
                              }
                              className="h-4 w-4 accent-orange-500"
                            />

                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                isSelected
                                  ? "bg-orange-500 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {String.fromCharCode(
                                65 + optionIndex
                              )}
                            </span>

                            <span
                              className={`text-sm font-medium ${
                                isSelected
                                  ? "text-orange-700"
                                  : "text-slate-600"
                              }`}
                            >
                              {option}
                            </span>

                          </label>
                        );
                      }
                    )}

                  </div>

                </CardContent>

              </Card>

            ))}


            {/* Submit */}
            <div className="flex justify-end">

              <Button
                onClick={submitQuiz}
                className="h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-7 font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Submit Quiz →
              </Button>

            </div>

          </div>
        )}


        {/* Result */}
        {!loading && questions.length > 0 && score !== null && (

          <div className="space-y-6">

            {/* Score card */}
            <Card className="overflow-hidden border-0 shadow-lg">

              <CardContent className="p-0">

                <div className="bg-gradient-to-br from-orange-500 via-amber-400 to-yellow-300 p-8 text-white md:p-10">

                  <div className="flex flex-col items-center text-center">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-4xl backdrop-blur-sm">
                      🎯
                    </div>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-widest text-white/70">
                      Quiz Completed
                    </p>

                    <h2 className="mt-2 text-4xl font-extrabold md:text-5xl">
                      {score}/{questions.length}
                    </h2>

                    <p className="mt-2 text-lg text-white/80">
                      {percentage}% Score
                    </p>

                    <div className="mt-6 h-3 w-full max-w-md overflow-hidden rounded-full bg-white/20">

                      <div
                        className="h-full rounded-full bg-white transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

              </CardContent>

            </Card>


            {/* Answer review */}
            <Card className="border-0 bg-white shadow-sm">

              <CardContent className="p-6 md:p-8">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-xl">
                    📋
                  </div>

                  <div>

                    <h2 className="text-2xl font-bold text-slate-800">
                      Answer Review
                    </h2>

                    <p className="text-sm text-slate-400">
                      Review your responses and correct answers.
                    </p>

                  </div>

                </div>


                <div className="mt-7 space-y-5">

                  {questions.map(
                    (question, index) => {

                      const isCorrect =
                        selected[index] ===
                        question.answer;

                      return (
                        <div
                          key={index}
                          className={`rounded-2xl border p-5 ${
                            isCorrect
                              ? "border-emerald-100 bg-emerald-50/50"
                              : "border-red-100 bg-red-50/50"
                          }`}
                        >

                          <div className="flex gap-3">

                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm ${
                                isCorrect
                                  ? "bg-emerald-100 text-emerald-600"
                                  : "bg-red-100 text-red-600"
                              }`}
                            >
                              {index + 1}
                            </div>

                            <div className="flex-1">

                              <p className="font-bold leading-6 text-slate-800">
                                {question.question}
                              </p>

                              <p
                                className={`mt-3 text-sm font-semibold ${
                                  isCorrect
                                    ? "text-emerald-600"
                                    : "text-red-600"
                                }`}
                              >
                                {isCorrect
                                  ? "✅ Correct"
                                  : "❌ Incorrect"}
                              </p>

                              <p className="mt-2 text-sm text-slate-500">
                                <span className="font-semibold text-slate-700">
                                  Your Answer:
                                </span>{" "}
                                {selected[index] ||
                                  "Not answered"}
                              </p>

                              <p className="mt-1 text-sm text-slate-500">
                                <span className="font-semibold text-slate-700">
                                  Correct Answer:
                                </span>{" "}
                                {question.answer}
                              </p>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>


                {/* Another quiz */}
                <div className="mt-8 border-t border-slate-100 pt-6">

                  <Button
                    onClick={generateQuiz}
                    className="h-11 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-6 font-semibold text-white shadow-sm"
                  >
                    🔄 Take Another Quiz
                  </Button>

                </div>

              </CardContent>

            </Card>

          </div>

        )}

      </main>

    </div>
  );
}