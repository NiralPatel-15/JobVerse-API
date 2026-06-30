const { RECOMMENDATION_THRESHOLDS } = require("../scoring.constants");

const getRecommendation = (score) => {
  if (score >= RECOMMENDATION_THRESHOLDS.HIGHLY_RECOMMENDED) {
    return "Highly Recommended";
  }

  if (score >= RECOMMENDATION_THRESHOLDS.RECOMMENDED) {
    return "Recommended";
  }

  if (score >= RECOMMENDATION_THRESHOLDS.AVERAGE) {
    return "Average";
  }

  return "Low Match";
};

module.exports = getRecommendation;
