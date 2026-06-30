const RecruiterRisk = require("../../models/RecruiterRisk");

const calculateRiskLevel = (score) => {
  if (score >= 80) return "HIGH";
  if (score >= 40) return "MEDIUM";
  return "LOW";
};

exports.updateRecruiterRisk = async ({
  recruiterId,
  toxic = false,
  spam = false,
  rejected = false,
}) => {
  let risk = await RecruiterRisk.findOne({
    recruiter: recruiterId,
  });

  if (!risk) {
    risk = await RecruiterRisk.create({
      recruiter: recruiterId,
    });
  }

  risk.totalFlags += 1;

  if (toxic) risk.toxicJobs += 1;
  if (spam) risk.spamJobs += 1;
  if (rejected) risk.rejectedJobs += 1;

  const score =
    risk.toxicJobs * 25 + risk.spamJobs * 20 + risk.rejectedJobs * 15;

  risk.riskScore = score;
  risk.riskLevel = calculateRiskLevel(score);

  await risk.save();

  return risk;
};
