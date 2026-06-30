const Application = require("../../../models/Application");

const AutomationLog = require("../models/AutomationLog");

const { evaluatePipelineAutomation } = require("./pipelineAutomationService");

const executePipelineAutomation = async (applicationId) => {
  try {
    const automation = await evaluatePipelineAutomation(applicationId);

    if (!automation) {
      throw new Error("Automation not found");
    }

    const application = await Application.findById(applicationId);

    if (!application) {
      throw new Error("Application not found");
    }

    const previousStage = application.stage;

    application.stage = automation.recommendedStage;

    await application.save();

    /*
      CREATE AUTOMATION AUDIT LOG
    */

    await AutomationLog.create({
      application: application._id,

      candidate: application.candidate,

      job: application.job,

      previousStage,

      newStage: automation.recommendedStage,

      reason: automation.automationReason,

      executedBy: "recruiter",
    });

    return {
      success: true,

      previousStage,

      newStage: automation.recommendedStage,

      reason: automation.automationReason,
    };
  } catch (error) {
    console.error(error);

    throw error;
  }
};

module.exports = {
  executePipelineAutomation,
};
