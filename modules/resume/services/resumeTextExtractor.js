const fs = require("fs");

const path = require("path");

const pdfParse = require("pdf-parse");

const mammoth = require("mammoth");

// ========================================
// PDF TEXT EXTRACTION
// ========================================

const extractTextFromPDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);

  const data = await pdfParse(dataBuffer);

  return data.text;
};

// ========================================
// DOCX TEXT EXTRACTION
// ========================================

const extractTextFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value;
};

// ========================================
// MAIN RESUME TEXT EXTRACTION
// ========================================

const extractResumeText = async (file) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (extension === ".pdf") {
    return await extractTextFromPDF(file.path);
  }

  if (extension === ".docx" || extension === ".doc") {
    return await extractTextFromDOCX(file.path);
  }

  throw new Error("Unsupported file type");
};

module.exports = {
  extractResumeText,
};
