import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import API from "../services/api";

export default function AITutor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const [pdfFile, setPdfFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  async function uploadPDF() {
    if (!pdfFile) {
      alert("Please select a PDF first.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("pdf", pdfFile);

      const res = await API.post("/pdf/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setDocumentId(res.data.documentId);

      alert(
        `PDF uploaded successfully!\n${res.data.chunks} chunks created.`
      );
    } catch (err) {
      console.error("PDF Upload Error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to upload PDF."
      );
    } finally {
      setUploading(false);
    }
  }

  async function askAI() {
    if (!question.trim()) return;

    try {
      setLoading(true);
      setAnswer("");

      // Get logged-in student information
      const storedUser = localStorage.getItem("user");

      let userId = null;

      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          userId = user.id || user._id;
        } catch (error) {
          console.error(
            "Unable to read logged-in user:",
            error
          );
        }
      }

      // If a PDF has been uploaded, use RAG
      if (documentId) {
        const res = await API.post("/pdf/ask", {
          documentId,
          question: question.trim(),
        });

        setAnswer(res.data.answer);
      }

      // Otherwise use personalized AI Tutor
      else {
        const res = await API.post("/tutor/ask", {
          question: question.trim(),
          userId,
        });

        setAnswer(res.data.answer);
      }
    } catch (err) {
      console.error("AI Tutor Error:", err);

      if (err.response?.status === 429) {
        setAnswer(
          "⚠️ AI Tutor is temporarily unavailable because the Gemini API request quota has been reached. Please try again later."
        );
      } else {
        setAnswer(
          err.response?.data?.message ||
            "Sorry, I couldn't get a response. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-8 md:px-10">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-2xl shadow-md">
              🤖
            </div>

            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-500">
                AI Powered Learning
              </div>

              <h1 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
                AI Tutor
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Ask questions, understand concepts, and learn with AI.
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-8 md:px-10">

        <div className="grid gap-6 lg:grid-cols-5">

          {/* PDF section */}
          <Card className="border-0 bg-white shadow-sm lg:col-span-2">

            <CardContent className="p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-xl">
                  📄
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Study Material
                  </h2>

                  <p className="text-xs text-slate-400">
                    Ask questions from your PDF
                  </p>
                </div>

              </div>


              <div className="mt-6 rounded-2xl border-2 border-dashed border-blue-100 bg-blue-50/50 p-6 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                  📚
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Upload your study material
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Upload a PDF and ask the AI Tutor questions
                  based on its content.
                </p>


                <Input
                  type="file"
                  accept=".pdf"
                  className="mt-5 h-auto cursor-pointer rounded-xl border-slate-200 bg-white p-2 text-sm text-slate-600"
                  onChange={(e) => {
                    setPdfFile(e.target.files[0]);
                    setDocumentId(null);
                    setAnswer("");
                  }}
                />

              </div>


              {pdfFile && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-sm">
                    📄
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-700">
                      {pdfFile.name}
                    </p>

                    <p className="text-xs text-slate-400">
                      PDF selected
                    </p>

                  </div>

                </div>
              )}


              <Button
                onClick={uploadPDF}
                disabled={uploading || !pdfFile}
                className="mt-4 h-11 w-full rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {uploading
                  ? "⏳ Processing PDF..."
                  : "Upload & Process PDF"}
              </Button>


              {documentId && (
                <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4">

                  <div className="flex items-start gap-3">

                    <span className="text-lg text-emerald-500">
                      ✓
                    </span>

                    <div>

                      <p className="text-sm font-bold text-emerald-700">
                        PDF processed successfully
                      </p>

                      <p className="mt-1 text-xs leading-5 text-emerald-600">
                        Your questions will now be answered
                        using the uploaded study material.
                      </p>

                    </div>

                  </div>

                </div>
              )}

            </CardContent>

          </Card>


          {/* AI question section */}
          <Card className="border-0 bg-white shadow-sm lg:col-span-3">

            <CardContent className="flex min-h-[520px] flex-col p-7">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                  ✨
                </div>

                <div>

                  <h2 className="text-xl font-bold text-slate-800">
                    Ask your AI Tutor
                  </h2>

                  <p className="text-xs text-slate-400">
                    Get personalized explanations instantly
                  </p>

                </div>

              </div>


              {/* Welcome area */}
              {!answer && !loading && (
                <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">

                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-50 to-cyan-50 text-4xl">
                    🤖
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-800">
                    How can I help you learn?
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                    Ask an academic question or upload your study
                    material to get answers based on your PDF.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">

                    <span className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-600">
                      Explain a concept
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-medium text-blue-600">
                      Solve a problem
                    </span>

                    <span className="rounded-full bg-purple-50 px-3 py-2 text-xs font-medium text-purple-600">
                      Summarize notes
                    </span>

                  </div>

                </div>
              )}


              {/* Loading */}
              {loading && (
                <div className="flex flex-1 items-center justify-center py-12">

                  <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-cyan-50 text-3xl">
                      🤖
                    </div>

                    <p className="mt-4 font-semibold text-slate-700">
                      Thinking...
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      Your AI Tutor is preparing an answer.
                    </p>

                  </div>

                </div>
              )}


              {/* Answer */}
              {answer && !loading && (
                <div className="mt-6 flex-1">

                  <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 p-5">

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm text-white shadow-sm">
                        🤖
                      </div>

                      <div>

                        <p className="text-sm font-bold text-slate-800">
                          AI Tutor
                        </p>

                        <p className="text-xs text-slate-400">
                          Personalized response
                        </p>

                      </div>

                    </div>

                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {answer}
                    </p>

                  </div>

                </div>
              )}


              {/* Question input */}
              <div className="mt-6 border-t border-slate-100 pt-5">

                {documentId && (
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600">
                    📄 Asking about your uploaded PDF
                  </div>
                )}

                <div className="flex gap-3">

                  <Input
                    className="h-12 flex-1 rounded-xl border-slate-200 bg-slate-50 text-slate-800 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-400"
                    placeholder={
                      documentId
                        ? "Ask something about your PDF..."
                        : "Ask any academic question..."
                    }
                    value={question}
                    onChange={(e) =>
                      setQuestion(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        askAI();
                      }
                    }}
                  />

                  <Button
                    onClick={askAI}
                    disabled={
                      loading || !question.trim()
                    }
                    className="h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 font-semibold text-white shadow-sm"
                  >
                    {loading ? "..." : "Ask →"}
                  </Button>

                </div>

                <p className="mt-2 text-xs text-slate-400">
                  Press Enter to ask your question.
                </p>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* Bottom information */}
        <div className="mt-6 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 p-5">

          <div className="flex flex-col gap-3 md:flex-row md:items-center">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              💡
            </div>

            <div>

              <p className="text-sm font-bold text-slate-700">
                Smart learning support
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                EduAI can personalize answers based on your learning
                profile, and uploaded PDFs can be used as study context.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}