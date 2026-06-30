const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    technicalSkills: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    communication: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    problemSolving: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    culturalFit: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    leadership: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
  },
  { _id: false },
);

const InterviewFeedbackSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    interviewRound: {
      type: String,
      enum: ["HR", "Technical", "Managerial", "Final"],
      required: true,
    },

    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    feedback: {
      type: String,
      required: true,
      trim: true,
    },

    strengths: [
      {
        type: String,
        trim: true,
      },
    ],

    weaknesses: [
      {
        type: String,
        trim: true,
      },
    ],

    scores: scoreSchema,

    recommendation: {
      type: String,
      enum: ["Strong Hire", "Hire", "Neutral", "Reject", "Strong Reject"],
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    visibility: {
      type: String,
      enum: ["Private", "Panel", "Admin"],
      default: "Panel",
    },
  },
  {
    timestamps: true,
  },
);

InterviewFeedbackSchema.pre("save", function (next) {
  const values = Object.values(this.scores.toObject());

  const avg = values.reduce((acc, val) => acc + val, 0) / values.length;

  this.overallScore = Number(avg.toFixed(1));

  next();
});

module.exports = mongoose.model("InterviewFeedback", InterviewFeedbackSchema);
