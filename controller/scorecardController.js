const HiringScorecard = require("../models/HiringScorecard");

const getScorecard = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const scorecard = await HiringScorecard.findOne({
      application: applicationId,
    });

    res.json({
      success: true,
      scorecard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch scorecard",
    });
  }
};

module.exports = {
  getScorecard,
};
