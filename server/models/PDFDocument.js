const mongoose = require("mongoose");

const pdfDocumentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    fileName: {
      type: String,
      required: true,
    },

    chunks: [
      {
        text: {
          type: String,
          required: true,
        },

        embedding: {
          type: [Number],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PDFDocument", pdfDocumentSchema);