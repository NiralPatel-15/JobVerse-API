const mongoose = require("mongoose");

const moderationLogSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    action: {
      type: String,
      enum: ["FLAGGED", "APPROVED", "REJECTED", "MANUAL_OVERRIDE"],
      required: true,
    },

    aiScore: {
      type: Number,
      default: 0,
    },

    toxicityScore: {
      type: Number,
      default: 0,
    },

    spamScore: {
      type: Number,
      default: 0,
    },

    reason: {
      type: String,
    },

    moderatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ModerationLog", moderationLogSchema);
