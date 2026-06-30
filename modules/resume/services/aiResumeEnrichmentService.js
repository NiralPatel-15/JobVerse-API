const enrichResumeAI = async (parsedData) => {
  const skills = parsedData.skills || [];

  const totalExperience =
    parsedData.experience?.reduce((acc, item) => acc + (item.years || 0), 0) ||
    0;

  let seniorityLevel = "Junior";

  if (totalExperience >= 8) {
    seniorityLevel = "Senior";
  } else if (totalExperience >= 4) {
    seniorityLevel = "Mid-Level";
  }

  return {
    overallScore: Math.min(100, skills.length * 5 + totalExperience * 4),

    confidenceScore: 85,

    strengths: skills.slice(0, 5).map((s) => s.name),

    weaknesses: [],

    seniorityLevel,

    recommendedRoles: [
      "Software Engineer",
      "Frontend Developer",
      "MERN Stack Developer",
    ],

    careerLevel: seniorityLevel,

    jobReadiness: 82,
  };
};

module.exports = {
  enrichResumeAI,
};
