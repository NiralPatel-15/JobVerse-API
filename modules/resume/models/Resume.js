const mongoose = require("mongoose");

const ResumeSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    originalFileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
    },

    parsingStatus: {
      type: String,
      enum: ["UPLOADING", "PARSING", "PROCESSING", "COMPLETED", "FAILED"],
      default: "UPLOADING",
      index: true,
    },

    rawText: {
      type: String,
    },

    parsedData: {
      basics: {
        fullName: String,
        email: String,
        phone: String,
        location: String,
        linkedin: String,
        github: String,
        portfolio: String,
      },

      summary: String,

      skills: [
        {
          name: String,
          score: Number,
        },
      ],

      experience: [
        {
          company: String,
          role: String,
          startDate: Date,
          endDate: Date,
          currentlyWorking: Boolean,
          description: String,
          years: Number,
        },
      ],

      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date,
          grade: String,
        },
      ],

      certifications: [String],

      projects: [
        {
          title: String,
          description: String,
          technologies: [String],
        },
      ],
    },

    aiInsights: {
      overallScore: {
        type: Number,
        default: 0,
      },

      confidenceScore: {
        type: Number,
        default: 0,
      },

      strengths: [String],

      weaknesses: [String],

      seniorityLevel: {
        type: String,
      },

      recommendedRoles: [String],

      careerLevel: String,

      jobReadiness: Number,
    },

    embeddings: {
      vector: [Number],
      model: String,
      generatedAt: Date,
    },

    searchableText: {
      type: String,
      index: "text",
    },

    metadata: {
      totalExperienceYears: Number,
      currentCompany: String,
      currentRole: String,
      highestEducation: String,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Resume", ResumeSchema);
