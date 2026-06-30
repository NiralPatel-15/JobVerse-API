const talentMatchService = require("../services/talentMatchService");

const getTalentMatches = async (req, res) => {
  try {
    const { jobId } = req.params;

    const matches = await talentMatchService.analyzeTalentMatch(jobId);

    res.status(200).json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error("Talent match error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to analyze talent match",
    });
  }
};

module.exports = {
  getTalentMatches,
};
