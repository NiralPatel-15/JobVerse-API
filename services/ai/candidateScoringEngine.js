const { extractSkills } = require("./skillExtractionEngine");

const calculateRecommendation = (score) => {
  if (score >= 85) return "STRONG_MATCH";

  if (score >= 70) return "GOOD_MATCH";

  if (score >= 50) return "AVERAGE_MATCH";

  return "WEAK_MATCH";
};

exports.scoreCandidate = ({ resumeText, jobSkills, experienceYears = 0 }) => {
  const extractedSkills = extractSkills(resumeText);

  const matchedSkills = extractedSkills.filter((skill) =>
    jobSkills.includes(skill),
  );

  const missingSkills = jobSkills.filter(
    (skill) => !extractedSkills.includes(skill),
  );

  const skillMatchScore =
    (matchedSkills.length / Math.max(jobSkills.length, 1)) * 100;

  const experienceScore = Math.min(experienceYears * 10, 100);

  const keywordScore = Math.min(extractedSkills.length * 5, 100);

  const overallScore =
    skillMatchScore * 0.5 + experienceScore * 0.3 + keywordScore * 0.2;

  return {
    extractedSkills,
    matchedSkills,
    missingSkills,

    skillMatchScore: Math.round(skillMatchScore),

    experienceScore: Math.round(experienceScore),

    keywordScore: Math.round(keywordScore),

    overallScore: Math.round(overallScore),

    recommendation: calculateRecommendation(overallScore),

    aiInsights: [
      `Matched ${matchedSkills.length} required skills`,
      `Missing ${missingSkills.length} required skills`,
      `AI confidence score: ${Math.round(overallScore)}%`,
    ],
  };
};
