const shortlistService = require("../services/shortlistService");

const getShortlistRecommendations = async (req, res) => {
  try {
    const { jobId } = req.params;

    const data = await shortlistService.getShortlistRecommendations(jobId);

    res.status(200).json({
      success: true,
      recommendations: data,
    });
  } catch (error) {
    console.error("Shortlist recommendation error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate shortlist",
    });
  }
};

module.exports = {
  getShortlistRecommendations,
};
