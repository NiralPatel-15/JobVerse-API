const Resume = require("../models/Resume");

const createResumeDocument = async ({
  candidateId,
  uploadedBy,
  fileUrl,
  originalFileName,
  mimeType,
}) => {
  return Resume.create({
    candidate: candidateId,
    uploadedBy,
    fileUrl,
    originalFileName,
    mimeType,
    parsingStatus: "UPLOADING",
  });
};

const updateResumeParsing = async (resumeId, updateData) => {
  return Resume.findByIdAndUpdate(resumeId, updateData, { new: true });
};

module.exports = {
  createResumeDocument,
  updateResumeParsing,
};
