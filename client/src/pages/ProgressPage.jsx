import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user || !user.id) {
          console.error("User information not found.");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/progress/${user.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }

        const data = await response.json();

        console.log("Progress data:", data);

        setProgress(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-10">
        <h1 className="text-4xl font-bold">
          📈 Progress Dashboard
        </h1>

        <p className="mt-6 text-slate-400">
          Loading progress...
        </p>
      </div>
    );
  }

  const attempts = progress?.attempts || [];
  const subjects = progress?.subjectPerformance || [];
  const topics = progress?.topicPerformance || [];

  // Performance Insight
  let performanceMessage = "";

  if (!progress || progress.totalQuizzes === 0) {
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
} else if (progress.weakArea && topics.length > 0) {
  const weakestTopic = topics.reduce((weakest, current) =>
    current.averageScore < weakest.averageScore
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      {/* Page Heading */}
      <h1 className="text-4xl font-bold mb-8">
        📈 Progress Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">
              Quizzes Completed
            </h2>

            <p className="text-5xl text-green-400 mt-4">
              {progress?.totalQuizzes || 0}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">
              Average Score
            </h2>

            <p className="text-5xl text-blue-400 mt-4">
              {progress?.averageScore || 0}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold">
              Best Score
            </h2>

            <p className="text-5xl text-yellow-400 mt-4">
              {progress?.bestScore || 0}%
            </p>
          </CardContent>
        </Card>

      </div>

      {/* Performance Insight */}
      <Card className="bg-slate-900 border-slate-800 mt-8">
        <CardContent className="p-6">

          <h2 className="text-2xl font-bold">
            🧠 Performance Insight
          </h2>

          <p className="text-slate-300 text-lg mt-4">
            {performanceMessage}
          </p>

        </CardContent>
      </Card>

      {/* Weak and Strong Areas */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">

            <h2 className="text-2xl font-bold">
              ⚠️ Weak Area
            </h2>

            {progress?.weakArea ? (
              <>
                <p className="text-xl font-semibold mt-4">
                  {progress.weakArea.subject}
                </p>

                <p className="text-red-400 text-3xl font-bold mt-2">
                  {progress.weakArea.averageScore}%
                </p>

                <p className="text-slate-400 mt-2">
                  Needs more practice
                </p>
              </>
            ) : (
              <p className="text-slate-400 mt-4">
                Complete more quizzes to identify weak areas.
              </p>
            )}

          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6">

            <h2 className="text-2xl font-bold">
              💪 Strong Area
            </h2>

            {progress?.strongArea ? (
              <>
                <p className="text-xl font-semibold mt-4">
                  {progress.strongArea.subject}
                </p>

                <p className="text-green-400 text-3xl font-bold mt-2">
                  {progress.strongArea.averageScore}%
                </p>

                <p className="text-slate-400 mt-2">
                  Good understanding
                </p>
              </>
            ) : (
              <p className="text-slate-400 mt-4">
                Complete more quizzes to identify strong areas.
              </p>
            )}

          </CardContent>
        </Card>

      </div>

      {/* Subject Performance */}
      <Card className="bg-slate-900 border-slate-800 mt-8">
        <CardContent className="p-6">

          <h2 className="text-2xl font-bold mb-6">
            📚 Subject Performance
          </h2>

          {subjects.length === 0 ? (
            <p className="text-slate-400">
              Complete quizzes to see subject performance.
            </p>
          ) : (
            <div className="space-y-5">

              {subjects.map((subject, index) => (
                <div key={index}>

                  <div className="flex justify-between mb-2">
                    <span className="font-semibold">
                      {subject.subject}
                    </span>

                    <span>
                      {subject.averageScore}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 rounded-full h-3">

                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{
                        width: `${subject.averageScore}%`,
                      }}
                    />

                  </div>

                </div>
              ))}

            </div>
          )}

        </CardContent>
      </Card>

      {/* Topic Performance */}
      <Card className="bg-slate-900 border-slate-800 mt-8">
        <CardContent className="p-6">

          <h2 className="text-2xl font-bold mb-6">
            🎯 Topic Performance
          </h2>

          {topics.length === 0 ? (
            <p className="text-slate-400">
              Complete quizzes to see topic performance.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">

              {topics.map((topic, index) => (
                <div
                  key={index}
                  className="bg-slate-800 rounded-lg p-4"
                >

                  <p className="font-semibold">
                    {topic.topic}
                  </p>

                  <p className="text-blue-400 text-2xl font-bold mt-2">
                    {topic.averageScore}%
                  </p>

                  <p className="text-sm text-slate-400">
                    {topic.attempts} quiz
                    {topic.attempts !== 1 ? "zes" : ""}
                  </p>

                </div>
              ))}

            </div>
          )}

        </CardContent>
      </Card>

      {/* What To Do Next */}
      <Card className="bg-slate-900 border-slate-800 mt-8">
        <CardContent className="p-6">

          <h2 className="text-2xl font-bold">
            🎯 What To Do Next?
          </h2>

          <p className="text-slate-300 text-lg mt-4">
            {recommendation}
          </p>

        </CardContent>
      </Card>

      {/* Score Trend */}
      <Card className="bg-slate-900 border-slate-800 mt-8">
        <CardContent className="p-6">

          <h2 className="text-2xl font-bold mb-6">
            📊 Score Trend
          </h2>

          {attempts.length === 0 ? (
            <p className="text-slate-400">
              Complete quizzes to see your score trend.
            </p>
          ) : (
            <div className="space-y-4">

              {[...attempts]
                .reverse()
                .map((attempt, index) => (
                  <div key={attempt._id || index}>

                    <div className="flex justify-between mb-1">

                      <span className="text-slate-300">
                        Quiz {index + 1}
                      </span>

                      <span className="font-semibold">
                        {attempt.percentage}%
                      </span>

                    </div>

                    <div className="w-full bg-slate-800 rounded-full h-3">

                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{
                          width: `${attempt.percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                ))}

            </div>
          )}

        </CardContent>
      </Card>

      {/* Recent Quiz History */}
      <Card className="bg-slate-900 border-slate-800 mt-8">
        <CardContent className="p-6">

          <h2 className="text-2xl font-bold mb-6">
            📚 Recent Quiz History
          </h2>

          {attempts.length === 0 ? (
            <p className="text-slate-400">
              No quizzes completed yet.
            </p>
          ) : (
            <div className="space-y-4">

              {attempts.map((attempt, index) => (
                <div
                  key={attempt._id || index}
                  className="flex flex-col md:flex-row md:items-center md:justify-between bg-slate-800 rounded-lg p-4"
                >

                  <div>

                    <h3 className="font-semibold text-lg">
                      {attempt.topic || "General Quiz"}
                    </h3>

                    <p className="text-sm text-slate-400">
                      {attempt.subject || "General"}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(
                        attempt.completedAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="mt-3 md:mt-0 text-right">

                    <p className="text-2xl font-bold">
                      {attempt.percentage}%
                    </p>

                    <p className="text-sm text-slate-400">
                      {attempt.score} /{" "}
                      {attempt.totalQuestions} correct
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </CardContent>
      </Card>

    </div>
  );
}