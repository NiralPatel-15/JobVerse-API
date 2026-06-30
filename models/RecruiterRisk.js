const mongoose = require("mongoose");

const recruiterRiskSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },

    totalFlags: {
      type: Number,
      default: 0,
    },

    rejectedJobs: {
      type: Number,
      default: 0,
    },

    toxicJobs: {
      type: Number,
      default: 0,
    },

    spamJobs: {
      type: Number,
      default: 0,
    },

    riskScore: {
      type: Number,
      default: 0,
    },

    riskLevel: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      default: "LOW",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RecruiterRisk", recruiterRiskSchema);
