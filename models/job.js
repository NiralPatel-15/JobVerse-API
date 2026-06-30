const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      default: "",
    },

    jobType: {
      type: String,
      default: "Full-Time",
    },

    salary: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    workMode: {
      type: String,
      default: "Onsite",
    },

    image: {
      type: String,
      default:
        "https://img.freepik.com/free-vector/job-interview-conversation_74855-7566.jpg",
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,

      enum: ["pending", "approved", "rejected"],

      default: "pending",
    },

    // =========================================
    // AI MODERATION
    // =========================================

    aiModeration: {
      spamScore: {
        type: Number,
        default: 0,
      },

      classification: {
        type: String,
        default: "Safe",
      },

      detectedFlags: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);