const CandidateScore = require("../models/CandidateScore");

const recalculateRankings = async (jobId) => {
  const candidates = await CandidateScore.find({
    jobId,
  }).sort({
    "scores.finalScore": -1,
  });

  for (let i = 0; i < candidates.length; i++) {
    candidates[i].rankingPosition = i + 1;

    await candidates[i].save();
  }

  return candidates;
};

module.exports = recalculateRankings;
