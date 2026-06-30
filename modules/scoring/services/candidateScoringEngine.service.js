const calculateSkillsScore = require("./skillsScoring.service");

const calculateExperienceScore = require("./experienceScoring.service");

const calculateResumeQuality = require("./resumeQuality.service");

const calculateFinalScore = require("../utils/calculateFinalScore");

const getRecommendation = require("../utils/getRecommendation");

const generateCandidateScore = async ({ job, candidate, parsedResume }) => {
  const skillsResult = calculateSkillsScore(
    job.skillsRequired || [],
    parsedResume.skills || [],
  );

  const experienceScore = calculateExperienceScore(
    job.experienceRequired || 0,
    parsedResume.totalExperience || 0,
  );

  const resumeQualityScore = calculateResumeQuality(parsedResume);

  const scores = {
    skills: skillsResult.score,
    experience: experienceScore,
    resumeQuality: resumeQualityScore,
    keywordMatch: skillsResult.score,
    education: 75,
  };

  const finalScore = calculateFinalScore(scores);

  return {
    scores: {
      ...scores,
      finalScore,
    },

    recommendation: getRecommendation(finalScore),

    metadata: {
      matchedSkills: skillsResult.matchedSkills,

      missingSkills: skillsResult.missingSkills,

      strengths: finalScore >= 80 ? ["Strong skill alignment"] : [],

      weaknesses: skillsResult.missingSkills,
    },
  };
};

module.exports = generateCandidateScore;
