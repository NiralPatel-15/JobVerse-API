const Application = require("../../../models/Application");

const {
  generateCandidateInsights,
} = require("../services/candidateInsightsService");

const getCandidateInsights = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("user")
      .populate("job");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const insights = generateCandidateInsights(application, application.job);

    return res.status(200).json({
      success: true,

      insights: {
        atsScore: application.atsScore,

        skillsScore: application.skillsScore,

        experienceScore: application.experienceScore,

        resumeQualityScore: application.resumeQualityScore,

        matchedSkills: insights.matchedSkills,

        missingSkills: insights.missingSkills,

        strengths: insights.strengths,

        weaknesses: insights.weaknesses,

        atsReasoning: insights.atsReasoning,
      },
    });
  } catch (error) {
    console.error("Candidate insights error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate insights",
    });
  }
};

module.exports = {
  getCandidateInsights,
};
