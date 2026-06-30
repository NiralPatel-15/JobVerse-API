const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    resumeText: {
      type: String,
      default: "",
    },

    experienceYears: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,

      enum: [
        "pending",
        "shortlisted",
        "interview",
        "offer_sent",
        "accepted",
        "rejected",
        "hired",
      ],

      default: "pending",
    },

    // ATS intelligence scores
    atsScore: {
      type: Number,
      default: 0,
    },

    skillsScore: {
      type: Number,
      default: 0,
    },

    experienceScore: {
      type: Number,
      default: 0,
    },

    resumeQualityScore: {
      type: Number,
      default: 0,
    },

    // insights
    matchedSkills: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    atsReasoning: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.Application ||
  mongoose.model("Application", ApplicationSchema);
