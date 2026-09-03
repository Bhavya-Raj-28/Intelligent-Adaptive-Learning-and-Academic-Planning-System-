import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import API from "../services/api";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [selected, setSelected] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

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

      // Backend returns:
      // { success: true, quiz: { questions: [...] } }

     const generatedQuestions = res.data.quiz?.questions || [];

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

  function submitQuiz() {
    let correct = 0;

    questions.forEach((question, index) => {
      if (selected[index] === question.answer) {
        correct++;
      }
    });

    setScore(correct);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        📝 Adaptive Quiz
      </h1>

      {/* Generate button */}
      {questions.length === 0 && (

        <Button
          onClick={generateQuiz}
          disabled={loading}
        >
          {loading
            ? "Generating Quiz..."
            : "Generate Quiz"}
        </Button>

      )}

      {/* Loading message */}
      {loading && (
        <div className="mt-8">
          <p className="text-xl text-slate-300">
            🤖 AI is preparing your personalized quiz...
          </p>

          <p className="text-slate-500 mt-2">
            Questions are being generated based on your weak subjects.
          </p>
        </div>
      )}

      {/* Questions */}
      {!loading && questions.length > 0 && (

        <div className="space-y-6 mt-8">

          {questions.map((question, index) => (

            <Card
              key={index}
              className="bg-slate-900 border-slate-800"
            >

              <CardContent className="p-6">

                <h2 className="text-xl font-bold mb-5">
                  {index + 1}. {question.question}
                </h2>

                {question.options.map((option, optionIndex) => (

                  <label
                    key={optionIndex}
                    className="block mb-3 cursor-pointer"
                  >

                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={
                        selected[index] === option
                      }
                      onChange={() =>
                        handleSelect(index, option)
                      }
                      className="mr-3"
                    />

                    {option}

                  </label>

                ))}

                {question.difficulty && (
                  <p className="text-slate-500 mt-4">
                    Difficulty: {question.difficulty}
                  </p>
                )}

              </CardContent>

            </Card>

          ))}

          {/* Submit */}
          {score === null && (

            <Button
              className="mt-4"
              onClick={submitQuiz}
            >
              Submit Quiz
            </Button>

          )}

        </div>

      )}

      {/* Result */}
      {score !== null && (

        <Card className="mt-8 bg-slate-900 border-slate-800">

          <CardContent className="p-6">

            <h2 className="text-3xl font-bold mb-6">
              🎯 Your Score: {score}/{questions.length}
            </h2>

            <h3 className="text-2xl font-bold mb-6">
              Correct Answers
            </h3>

            <div className="space-y-6">

              {questions.map((question, index) => (

                <div
                  key={index}
                  className="border-b border-slate-700 pb-5"
                >

                  <p className="font-bold">
                    {index + 1}. {question.question}
                  </p>

                  {selected[index] === question.answer ? (
  <p className="text-green-400 mt-2">
    ✅ Correct
  </p>
) : (
  <p className="text-red-400 mt-2">
    ❌ Incorrect
  </p>
)}

<p className="text-slate-400 mt-1">
  Your Answer: {selected[index] || "Not answered"}
</p>

<p className="text-green-400 mt-1">
  Correct Answer: {question.answer}
</p>

                </div>

              ))}

            </div>

            {/* Another quiz */}
            <Button
              className="mt-8"
              onClick={generateQuiz}
            >
              🔄 Take Another Quiz
            </Button>

          </CardContent>

        </Card>

      )}

    </div>
  );
}