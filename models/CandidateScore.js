const mongoose = require("mongoose");

const candidateScoreSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    extractedSkills: [
      {
        type: String,
      },
    ],

    matchedSkills: [
      {
        type: String,
      },
    ],

    missingSkills: [
      {
        type: String,
      },
    ],

    skillMatchScore: {
      type: Number,
      default: 0,
    },

    experienceScore: {
      type: Number,
      default: 0,
    },

    educationScore: {
      type: Number,
      default: 0,
    },

    keywordScore: {
      type: Number,
      default: 0,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    recommendation: {
      type: String,
      enum: ["STRONG_MATCH", "GOOD_MATCH", "AVERAGE_MATCH", "WEAK_MATCH"],
      default: "AVERAGE_MATCH",
    },

    aiInsights: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.CandidateScore ||
  mongoose.model("CandidateScore", candidateScoreSchema);
