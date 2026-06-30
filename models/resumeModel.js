const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // =========================
    // Personal Information
    // =========================
    personal_info: {
      first_name: {
        type: String,
        default: "",
      },

      last_name: {
        type: String,
        default: "",
      },

      full_name: {
        type: String,
        default: "",
      },

      profession: {
        type: String,
        default: "",
      },

      headline: {
        type: String,
        default: "",
      },
      email: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      address: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
      linkedin: {
        type: String,
        default: "",
      },
      github: {
        type: String,
        default: "",
      },
      portfolio: {
        type: String,
        default: "",
      },
      website: {
        type: String,
        default: "",
      },
      image: {
        type: String,
        default: "",
      },
    },

    // =========================
    // Professional Summary
    // =========================
    summary: {
      type: String,
      default: "",
    },

    // =========================
    // Skills
    // =========================
    skills: [
      {
        type: String,
      },
    ],

    // =========================
    // Education
    // =========================
    education: [
      {
        school: {
          type: String,
          default: "",
        },
        degree: {
          type: String,
          default: "",
        },
        fieldOfStudy: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          default: "",
        },
        endDate: {
          type: String,
          default: "",
        },
        grade: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================
    // Experience
    // =========================
    experience: [
      {
        company: {
          type: String,
          default: "",
        },
        position: {
          type: String,
          default: "",
        },
        location: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          default: "",
        },
        endDate: {
          type: String,
          default: "",
        },
        currentJob: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================
    // Projects
    // =========================
    projects: [
      {
        title: {
          type: String,
          default: "",
        },
        technologies: [
          {
            type: String,
          },
        ],
        github: {
          type: String,
          default: "",
        },
        liveDemo: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================
    // Certifications
    // =========================
    certifications: [
      {
        name: {
          type: String,
          default: "",
        },
        issuer: {
          type: String,
          default: "",
        },
        issueDate: {
          type: String,
          default: "",
        },
        credentialId: {
          type: String,
          default: "",
        },
        credentialUrl: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================
    // Languages
    // =========================
    languages: [
      {
        name: {
          type: String,
          default: "",
        },
        proficiency: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================
    // Achievements
    // =========================
    achievements: [
      {
        title: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],

    // =========================
    // Interests
    // =========================
    interests: [
      {
        type: String,
      },
    ],
    template: {
      type: String,
      default: "modern",
    },

    accentColor: {
      type: String,
      default: "#4f46e5",
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.UserResume || mongoose.model("UserResume", resumeSchema);
