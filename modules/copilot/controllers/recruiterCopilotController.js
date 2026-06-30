const Application = require("../../../models/application");

const {
  generateRecruiterCopilot,
} = require("../services/recruiterCopilotService");

const getRecruiterCopilot = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("user");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    const copilot = generateRecruiterCopilot(application, application.job);

    return res.status(200).json({
      success: true,
      copilot,
    });
  } catch (error) {
    console.error("Recruiter copilot error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate recruiter copilot",
    });
  }
};

module.exports = {
  getRecruiterCopilot,
};
