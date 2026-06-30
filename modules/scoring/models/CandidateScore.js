const mongoose = require("mongoose");

const CandidateScoreSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    scores: {
      skills: {
        type: Number,
        default: 0,
      },

      experience: {
        type: Number,
        default: 0,
      },

      resumeQuality: {
        type: Number,
        default: 0,
      },

      keywordMatch: {
        type: Number,
        default: 0,
      },

      education: {
        type: Number,
        default: 0,
      },

      recruiterWeight: {
        type: Number,
        default: 0,
      },

      finalScore: {
        type: Number,
        default: 0,
        index: true,
      },
    },

    rankingPosition: {
      type: Number,
      default: 0,
      index: true,
    },

    recommendation: {
      type: String,
      enum: ["Highly Recommended", "Recommended", "Average", "Low Match"],
      default: "Average",
    },

    metadata: {
      missingSkills: [String],
      matchedSkills: [String],
      strengths: [String],
      weaknesses: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("CandidateScore", CandidateScoreSchema);
