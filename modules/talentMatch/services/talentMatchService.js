const Application = require("../../../models/application");

const normalizeSkills = (skills = []) => {
  return skills.map((skill) => skill.toLowerCase().trim());
};

const calculateMatch = (candidateSkills, requiredSkills) => {
  const normalizedCandidate = normalizeSkills(candidateSkills);

  const normalizedRequired = normalizeSkills(requiredSkills);

  const matchedSkills = normalizedRequired.filter((skill) =>
    normalizedCandidate.includes(skill),
  );

  const missingSkills = normalizedRequired.filter(
    (skill) => !normalizedCandidate.includes(skill),
  );

  const score = Math.round(
    (matchedSkills.length / (normalizedRequired.length || 1)) * 100,
  );

  return {
    score,
    matchedSkills,
    missingSkills,
  };
};

const generateHiringConfidence = (score) => {
  if (score >= 85) {
    return "Very High";
  }

  if (score >= 70) {
    return "High";
  }

  if (score >= 50) {
    return "Moderate";
  }

  return "Low";
};

const analyzeTalentMatch = async (jobId) => {
  const applications = await Application.find({
    job: jobId,
  })
    .populate("user")
    .populate("job");

  const results = applications.map((app) => {
    const candidateSkills = app.user?.skills || [];

    const requiredSkills = app.job?.requiredSkills || [];

    const match = calculateMatch(candidateSkills, requiredSkills);

    return {
      applicationId: app._id,
      candidate: app.user,
      matchScore: match.score,
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      hiringConfidence: generateHiringConfidence(match.score),
      status: app.status,
    };
  });

  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
};

module.exports = {
  analyzeTalentMatch,
};
