const mongoose = require("mongoose");

const panelMemberSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    role: {
      type: String,
      enum: [
        "Lead Interviewer",
        "Technical Interviewer",
        "HR Interviewer",
        "Observer",
      ],
      default: "Technical Interviewer",
    },

    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const InterviewPanelSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
      index: true,
    },

    round: {
      type: String,
      enum: ["HR", "Technical", "Managerial", "Final"],
      default: "Technical",
    },

    panelMembers: [panelMemberSchema],

    scheduledDate: {
      type: Date,
    },

    meetingLink: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InterviewPanel", InterviewPanelSchema);
