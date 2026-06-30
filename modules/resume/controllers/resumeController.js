const { extractResumeText } = require("../services/resumeTextExtractor");

const { runOCR } = require("../services/ocrService");

const {
  extractResumeEntities,
} = require("../extractors/resumeEntityExtractor");

// ========================================
// PARSE RESUME CONTROLLER
// ========================================

const parseResume = async (req, res) => {
  try {
    // ============================
    // VALIDATE FILE
    // ============================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    // ============================
    // EXTRACT TEXT
    // ============================

    let text = await extractResumeText(req.file);

    // ============================
    // OCR FALLBACK
    // ============================

    if (!text || text.trim().length < 50) {
      text = await runOCR(req.file.path);
    }

    // ============================
    // EXTRACT ENTITIES
    // ============================

    const parsedData = extractResumeEntities(text);

    // ============================
    // RESPONSE
    // ============================

    return res.status(200).json({
      success: true,

      parsedData,

      rawText: text,

      fileName: req.file.filename,
    });
  } catch (error) {
    console.error("Resume Parsing Error:", error);

    return res.status(500).json({
      success: false,
      message: "Resume parsing failed",
      error: error.message,
    });
  }
};

module.exports = {
  parseResume,
};
