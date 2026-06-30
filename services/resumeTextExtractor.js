const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");


const extractTextFromPDF = async (filePath) => {
  console.log("Reading:", filePath);

  const dataBuffer = fs.readFileSync(filePath);

  console.log("Buffer Size:", dataBuffer.length);

  const data = await pdfParse(dataBuffer);

  console.log("PDF Parsed");

  return data.text;
};

const extractTextFromDOCX = async (filePath) => {
  const result = await mammoth.extractRawText({
    path: filePath,
  });

  return result.value;
};

const extractResumeText = async (file) => {
  console.log("Extractor Called");

  console.log(file);

  const ext = path.extname(file.originalname).toLowerCase();

  console.log("Extension:", ext);

  if (ext === ".pdf") {
    console.log("Reading PDF...");

    return await extractTextFromPDF(file.path);
  }

  if (ext === ".docx" || ext === ".doc") {
    console.log("Reading DOCX...");

    return await extractTextFromDOCX(file.path);
  }

  throw new Error("Unsupported resume type");
};



module.exports = {
  extractResumeText,
};
