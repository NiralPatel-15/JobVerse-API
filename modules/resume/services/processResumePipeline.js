const Resume = require("../models/Resume");

const { enrichResumeAI } = require("./aiResumeEnrichmentService");

const { generateCandidateProfile } = require("./candidateProfileService");

const { buildSearchableText } = require("./searchableResumeService");

const processResumePipeline = async ({ resumeId, parsedData }) => {
  const aiInsights = await enrichResumeAI(parsedData);

  const metadata = generateCandidateProfile(parsedData);

  const searchableText = buildSearchableText(parsedData);

  const updatedResume = await Resume.findByIdAndUpdate(
    resumeId,
    {
      parsedData,
      aiInsights,
      metadata,
      searchableText,
      parsingStatus: "COMPLETED",
    },
    { new: true },
  );

  return updatedResume;
};

module.exports = {
  processResumePipeline,
};
