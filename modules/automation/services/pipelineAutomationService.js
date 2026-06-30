const Application = require("../../../models/application");
const CandidateScore = require("../../scoring/models/CandidateScore");

const evaluatePipelineAutomation = async (applicationId) => {
  try {
    const application = await Application.findById(applicationId)
      .populate("candidate")
      .populate("job");

    if (!application) {
      return null;
    }

    const scoreData = await CandidateScore.findOne({
      candidate: application.candidate._id,
      job: application.job._id,
    });

    if (!scoreData) {
      return null;
    }

    const updates = {
      recommendedStage: application.stage,
      automationReason: "",
      priorityLevel: "medium",
    };

    /*
      ENTERPRISE AUTOMATION RULES
    */

    // High ATS Score → Shortlist
    if (scoreData.totalScore >= 85 && application.stage === "applied") {
      updates.recommendedStage = "shortlisted";

      updates.automationReason =
        "High ATS score and strong candidate-job alignment.";

      updates.priorityLevel = "high";
    }

    // Medium Score → Screening
    else if (scoreData.totalScore >= 70 && application.stage === "applied") {
      updates.recommendedStage = "screening";

      updates.automationReason =
        "Candidate meets most required qualifications.";

      updates.priorityLevel = "medium";
    }

    // Low Score → Risk
    else if (scoreData.totalScore < 50) {
      updates.recommendedStage = "review";

      updates.automationReason =
        "Low ATS score detected. Manual recruiter review recommended.";

      updates.priorityLevel = "low";
    }

    return {
      applicationId: application._id,
      currentStage: application.stage,
      ...updates,
      score: scoreData.totalScore,
    };
  } catch (error) {
    console.error("Pipeline Automation Error:", error);

    throw error;
  }
};

module.exports = {
  evaluatePipelineAutomation,
};
