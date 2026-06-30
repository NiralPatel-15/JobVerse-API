const mongoose = require("mongoose");

const ApplicationTimelineSchema = new mongoose.Schema(
  {
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,

      enum: [
        "applied",
        "shortlisted",
        "interview",
        "accepted",
        "rejected",

        "offer_sent",
        "offer_accepted",
        "offer_rejected",
        "hired",

        "note",
        "feedback",

        "INTERVIEW_SCHEDULED",
        "INTERVIEW_RESCHEDULED",
        "INTERVIEW_COMPLETED",
        "INTERVIEW_CANCELLED",
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "ApplicationTimeline",
  ApplicationTimelineSchema,
);
