const mongoose = require("mongoose");

const HiringScorecardSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
      index: true,
    },

    totalInterviewers: {
      type: Number,
      default: 0,
    },

    averageScore: {
      type: Number,
      default: 0,
    },

    hiringConfidence: {
      type: Number,
      default: 0,
    },

    recommendationBreakdown: {
      strongHire: {
        type: Number,
        default: 0,
      },

      hire: {
        type: Number,
        default: 0,
      },

      neutral: {
        type: Number,
        default: 0,
      },

      reject: {
        type: Number,
        default: 0,
      },

      strongReject: {
        type: Number,
        default: 0,
      },
    },

    finalRecommendation: {
      type: String,
      enum: ["Strong Hire", "Hire", "Neutral", "Reject", "Strong Reject"],
      default: "Neutral",
    },

    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("HiringScorecard", HiringScorecardSchema);
