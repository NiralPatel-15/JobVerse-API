const Application = require("../../../models/application");

const {
  generateInterviewQuestions,
} = require("../services/interviewQuestionService");

const getInterviewQuestions = async (req, res) => {
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

    const questions = generateInterviewQuestions(application, application.job);

    return res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error("Interview copilot error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate interview questions",
    });
  }
};

module.exports = {
  getInterviewQuestions,
};
