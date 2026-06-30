const mongoose = require("mongoose");

const InterviewScheduleSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },

    panel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InterviewPanel",
    },

    round: {
      type: String,
      enum: ["HR", "Technical", "Managerial", "Final"],
      default: "Technical",
    },

    scheduledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruiter",
      required: true,
    },

    scheduledDate: {
      type: Date,
      required: true,
    },

    durationMinutes: {
      type: Number,
      default: 60,
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    meetingLink: {
      type: String,
      trim: true,
    },

    notes: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["Scheduled", "Rescheduled", "Completed", "Cancelled", "No Show"],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("InterviewSchedule", InterviewScheduleSchema);
