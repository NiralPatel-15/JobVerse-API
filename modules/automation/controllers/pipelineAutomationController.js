const {
  evaluatePipelineAutomation,
} = require("../services/pipelineAutomationService");

const {
  executePipelineAutomation,
} = require("../services/executeAutomationService");

const getPipelineAutomation = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const result = await evaluatePipelineAutomation(applicationId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Automation data not found",
      });
    }

    return res.status(200).json({
      success: true,
      automation: result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch automation insights",
    });
  }
};

const applyPipelineAutomation = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const result = await executePipelineAutomation(applicationId);

    return res.status(200).json({
      success: true,
      message: "Pipeline automation executed successfully",
      result,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to execute pipeline automation",
    });
  }
};

module.exports = {
  getPipelineAutomation,
  applyPipelineAutomation,
};
