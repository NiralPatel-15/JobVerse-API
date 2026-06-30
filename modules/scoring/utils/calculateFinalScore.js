const { DEFAULT_WEIGHTS } = require("../scoring.constants");

const calculateFinalScore = (scores) => {
  const finalScore =
    scores.skills * DEFAULT_WEIGHTS.skills +
    scores.experience * DEFAULT_WEIGHTS.experience +
    scores.resumeQuality * DEFAULT_WEIGHTS.resumeQuality +
    scores.keywordMatch * DEFAULT_WEIGHTS.keywordMatch +
    scores.education * DEFAULT_WEIGHTS.education;

  return Math.round(finalScore);
};

module.exports = calculateFinalScore;
