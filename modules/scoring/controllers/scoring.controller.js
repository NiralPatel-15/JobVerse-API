const CandidateScore = require("../models/CandidateScore");

const getRankedCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    const candidates = await CandidateScore.find({
      jobId,
    })
      .populate("candidateId", "name email profilePicture")
      .populate("applicationId")
      .sort({
        rankingPosition: 1,
      });

    return res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rankings",
    });
  }
};

module.exports = {
  getRankedCandidates,
};
