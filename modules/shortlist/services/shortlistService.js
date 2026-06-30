const Application = require("../../../models/application");

const calculateHiringFit = (candidate) => {
  let score = 0;

  // ATS score contribution
  score += candidate.atsScore || 0;

  // Resume intelligence contribution
  score += candidate.resumeScore || 0;

  // Interview score contribution
  score += candidate.interviewScore || 0;

  // Experience boost
  if (candidate.experience >= 5) {
    score += 15;
  }

  // Skill match boost
  if (candidate.skillMatch >= 80) {
    score += 20;
  }

  return Math.min(score, 100);
};

const generateRiskAnalysis = (candidate) => {
  const risks = [];

  if ((candidate.communicationScore || 0) < 50) {
    risks.push("Low communication skills");
  }

  if ((candidate.interviewScore || 0) < 50) {
    risks.push("Weak interview performance");
  }

  if ((candidate.skillMatch || 0) < 60) {
    risks.push("Low skill match");
  }

  if ((candidate.resumeScore || 0) < 50) {
    risks.push("Resume quality below benchmark");
  }

  return risks;
};

const generateRecommendation = (candidate) => {
  const fitScore = calculateHiringFit(candidate);

  if (fitScore >= 85) {
    return "Strong Hire";
  }

  if (fitScore >= 70) {
    return "Recommended";
  }

  if (fitScore >= 55) {
    return "Consider";
  }

  return "Not Recommended";
};

const getShortlistRecommendations = async (jobId) => {
  const applications = await Application.find({
    job: jobId,
  })
    .populate("candidate")
    .sort({ atsScore: -1 });

  const enriched = applications.map((app) => {
    const fitScore = calculateHiringFit(app);

    const risks = generateRiskAnalysis(app);

    const recommendation = generateRecommendation(app);

    return {
      _id: app._id,
      candidate: app.candidate,
      fitScore,
      recommendation,
      risks,
      atsScore: app.atsScore || 0,
      resumeScore: app.resumeScore || 0,
      interviewScore: app.interviewScore || 0,
      skillMatch: app.skillMatch || 0,
      status: app.status,
      createdAt: app.createdAt,
    };
  });

  enriched.sort((a, b) => b.fitScore - a.fitScore);

  return enriched;
};

module.exports = {
  getShortlistRecommendations,
};
