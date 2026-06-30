const InterviewFeedback = require("../models/InterviewFeedback");

const HiringScorecard = require("../models/HiringScorecard");

const calculateHiringScorecard = async (applicationId) => {
  const feedbacks = await InterviewFeedback.find({
    application: applicationId,
  });

  if (!feedbacks.length) return null;

  // =========================================
  // AVG SCORE
  // =========================================

  const averageScore =
    feedbacks.reduce((acc, item) => acc + item.overallScore, 0) /
    feedbacks.length;

  // =========================================
  // RECOMMENDATIONS
  // =========================================

  const recommendationBreakdown = {
    strongHire: 0,
    hire: 0,
    neutral: 0,
    reject: 0,
    strongReject: 0,
  };

  feedbacks.forEach((item) => {
    switch (item.recommendation) {
      case "Strong Hire":
        recommendationBreakdown.strongHire++;
        break;

      case "Hire":
        recommendationBreakdown.hire++;
        break;

      case "Neutral":
        recommendationBreakdown.neutral++;
        break;

      case "Reject":
        recommendationBreakdown.reject++;
        break;

      case "Strong Reject":
        recommendationBreakdown.strongReject++;
        break;

      default:
        break;
    }
  });

  // =========================================
  // FINAL RECOMMENDATION
  // =========================================

  const highest = Object.entries(recommendationBreakdown).sort(
    (a, b) => b[1] - a[1],
  )[0];

  const recommendationMap = {
    strongHire: "Strong Hire",
    hire: "Hire",
    neutral: "Neutral",
    reject: "Reject",
    strongReject: "Strong Reject",
  };

  const finalRecommendation = recommendationMap[highest[0]];

  // =========================================
  // CONFIDENCE
  // =========================================

  const confidence = Math.min(100, Math.round((averageScore / 5) * 100));

  // =========================================
  // UPSERT SCORECARD
  // =========================================

  const updated = await HiringScorecard.findOneAndUpdate(
    {
      application: applicationId,
    },
    {
      application: applicationId,

      totalInterviewers: feedbacks.length,

      averageScore: Number(averageScore.toFixed(1)),

      hiringConfidence: confidence,

      recommendationBreakdown,

      finalRecommendation,
    },
    {
      new: true,
      upsert: true,
    },
  );

  return updated;
};

module.exports = calculateHiringScorecard;
