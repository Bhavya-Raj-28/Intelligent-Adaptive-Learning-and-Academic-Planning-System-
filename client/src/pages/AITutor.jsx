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
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        🤖 AI Tutor
      </h1>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* PDF SECTION */}

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 space-y-4">

            <h2 className="text-xl font-bold">
              📄 Study Material
            </h2>

            <p className="text-slate-400">
              Upload your study material and ask questions
              based on it.
            </p>

            <Input
              type="file"
              accept=".pdf"
              className="bg-slate-800 border-slate-700 text-white"
              onChange={(e) => {
                setPdfFile(e.target.files[0]);
                setDocumentId(null);
                setAnswer("");
              }}
            />

            <Button
              onClick={uploadPDF}
              disabled={uploading || !pdfFile}
            >
              {uploading
                ? "Processing PDF..."
                : "Upload PDF"}
            </Button>

            {documentId && (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3">
                ✓ PDF processed successfully.
                <br />
                <span className="text-sm text-slate-300">
                  Ask a question about your study material.
                </span>
              </div>
            )}

          </CardContent>
        </Card>

        {/* AI TUTOR SECTION */}

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="p-6 space-y-5">

            <h2 className="text-xl font-bold">
              🤖 Ask your AI Tutor
            </h2>

            <Input
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
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
            >
              {loading
                ? "Thinking..."
                : "Ask AI"}
            </Button>

            {answer && (
              <div className="bg-slate-800 rounded-xl p-5">

                <h2 className="font-bold mb-3">
                  AI Tutor
                </h2>

                <p className="whitespace-pre-wrap leading-7">
                  {answer}
                </p>

              </div>
            )}

          </CardContent>
        </Card>

      </div>
    </div>
  );
}