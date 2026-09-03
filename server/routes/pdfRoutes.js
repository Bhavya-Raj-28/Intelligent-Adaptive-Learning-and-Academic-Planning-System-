const express = require("express");
const multer = require("multer");

const {
  uploadPDF,
  askPDF,
} = require("../controllers/pdfController");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

router.post(
  "/upload",
  upload.single("pdf"),
  uploadPDF
);

router.post("/ask", askPDF);

module.exports = router;