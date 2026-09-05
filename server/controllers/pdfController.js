const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

const PDFDocument = require("../models/PDFDocument");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================
// CREATE EMBEDDING FOR TEXT
// ======================================

async function createEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: {
      parts: [
        {
          text: text,
        },
      ],
    },
  });

  return response.embeddings[0].values;
}

// ======================================
// SPLIT PDF TEXT INTO CHUNKS
// ======================================

function createChunks(text, chunkSize = 1000) {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");

    if (chunk.trim()) {
      chunks.push(chunk);
    }
  }

  return chunks;
}

// ======================================
// CALCULATE COSINE SIMILARITY
// ======================================

function cosineSimilarity(a, b) {
  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

// ======================================
// UPLOAD PDF
// ======================================

exports.uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No PDF file uploaded",
      });
    }

    console.log("===== PDF UPLOAD =====");
    console.log("File:", req.file.originalname);

    const pdfBuffer = fs.readFileSync(req.file.path);

    const parser = new PDFParse({
      data: pdfBuffer,
    });

    const pdfData = await parser.getText();

    await parser.destroy();

    const text = pdfData.text;

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (!text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from this PDF",
      });
    }

    // Split PDF into chunks
    const chunks = createChunks(text);

    console.log("Number of chunks:", chunks.length);

    const embeddedChunks = [];

    // Create embeddings
    for (const chunk of chunks) {
      const embedding = await createEmbedding(chunk);

      embeddedChunks.push({
        text: chunk,
        embedding,
      });
    }

    // Store document in MongoDB
    const document = await PDFDocument.create({
      fileName: req.file.originalname,
      chunks: embeddedChunks,
    });

    console.log("PDF stored:", document._id);

    res.json({
      success: true,
      message: "PDF uploaded and indexed successfully",
      documentId: document._id,
      fileName: document.fileName,
      chunks: chunks.length,
    });
  } catch (error) {
    console.error("===== PDF ERROR =====");
    console.error(error);

    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "Gemini API quota exceeded while processing the PDF. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to process PDF",
      error: error.message,
    });
  }
};

// ======================================
// ASK QUESTION ABOUT PDF
// ======================================

exports.askPDF = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        message: "documentId and question are required",
      });
    }

    console.log("===== PDF QUESTION =====");
    console.log("Question:", question);

    const document = await PDFDocument.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "PDF not found",
      });
    }

    // ======================================
    // EMBED STUDENT QUESTION
    // ======================================

    let questionEmbedding;

    try {
      questionEmbedding = await createEmbedding(question);
    } catch (error) {
      console.error("EMBEDDING ERROR:", error);

      if (error.status === 429) {
        return res.status(429).json({
          success: false,
          message:
            "Gemini embedding quota has been temporarily exceeded. Please wait and try again later.",
        });
      }

      throw error;
    }

    // ======================================
    // RANK PDF CHUNKS
    // ======================================

    const rankedChunks = document.chunks
      .map((chunk) => ({
        text: chunk.text,
        score: cosineSimilarity(
          questionEmbedding,
          chunk.embedding
        ),
      }))
      .sort((a, b) => b.score - a.score);

    // Take the 5 most relevant chunks
    const topChunks = rankedChunks.slice(0, 5);

    console.log("===== RAG RETRIEVAL =====");

    topChunks.forEach((chunk, index) => {
      console.log(
        `\n--- Chunk ${index + 1} | Similarity: ${chunk.score.toFixed(
          4
        )} ---`
      );

      console.log(chunk.text.substring(0, 500));
    });

    const relevantChunks = topChunks
      .map((chunk) => chunk.text)
      .join("\n\n");

    console.log("=========================");

    // ======================================
    // CREATE GEMINI PROMPT
    // ======================================

    const prompt = `
You are an AI Tutor helping a university student understand their study material.

Use the retrieved sections from the student's PDF to answer the question.

PDF CONTEXT:
${relevantChunks}

STUDENT QUESTION:
${question}

Instructions:
- Explain the answer clearly.
- Use simple language where possible.
- Give examples when useful.
- Base the answer primarily on the provided PDF context.
- If the answer is not present in the provided context, clearly say that it was not found in the uploaded material.
`;

    // ======================================
    // ASK GEMINI
    // ======================================

    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(
          `===== GEMINI PDF ANSWER ATTEMPT ${attempt} =====`
        );

        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: prompt,
        });

        break;
      } catch (error) {
        console.error(
          `Gemini PDF answer attempt ${attempt} failed:`,
          error.status
        );

        // Gemini quota exceeded
        if (error.status === 429) {
          return res.status(429).json({
            success: false,
            message:
              "The AI Tutor has reached the Gemini API quota limit. Please try again later.",
          });
        }

        // Retry temporary Gemini server errors
        if (error.status !== 503 || attempt === 3) {
          throw error;
        }

        console.log(
          "Gemini temporarily unavailable. Retrying in 3 seconds..."
        );

        await new Promise((resolve) =>
          setTimeout(resolve, 3000)
        );
      }
    }

    // ======================================
    // CHECK GEMINI RESPONSE
    // ======================================

    if (!response || !response.text) {
      throw new Error("Gemini returned an empty response");
    }

    // ======================================
    // SEND ANSWER
    // ======================================

    res.json({
      success: true,
      answer: response.text,
    });
  } catch (error) {
    console.error("===== PDF QUESTION ERROR =====");
    console.error(error);

    if (error.status === 429) {
      return res.status(429).json({
        success: false,
        message:
          "The AI Tutor has reached the Gemini API quota limit. Please try again later.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to answer question",
      error: error.message,
    });
  }
};