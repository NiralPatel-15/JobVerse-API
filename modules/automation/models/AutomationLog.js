const mongoose = require("mongoose");

const automationLogSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },

    previousStage: {
      type: String,
      required: true,
    },

    newStage: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
      required: true,
    },

    automationType: {
      type: String,
      default: "stage_progression",
    },

    executedBy: {
      type: String,
      enum: ["ai", "recruiter"],
      default: "ai",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AutomationLog", automationLogSchema);
