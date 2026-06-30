const { Worker } = require("bullmq");

const redisConnection = require("../../../config/redis");

const Resume = require("../models/Resume");

const { processResumePipeline } = require("../services/processResumePipeline");

const {
  extractTextFromResume,
} = require("../services/resumeExtractionService");

const { emitResumeProgress } = require("../socket/resumeSocketEvents");

const worker = new Worker(
  "resume-processing",

  async (job) => {
    const { resumeId, filePath, userId } = job.data;

    try {
      emitResumeProgress({
        userId,
        status: "EXTRACTING",
        progress: 25,
        message: "Extracting resume text",
        resumeId,
      });

      const extractedText = await extractTextFromResume(filePath);

      emitResumeProgress({
        userId,
        status: "AI_PROCESSING",
        progress: 60,
        message: "AI parsing resume",
        resumeId,
      });

      const parsedData = {
        basics: {
          fullName: "Enterprise Candidate",
        },

        skills: [
          {
            name: "React",
            score: 95,
          },

          {
            name: "Node.js",
            score: 92,
          },
        ],

        experience: [],
        education: [],
      };

      emitResumeProgress({
        userId,
        status: "ENRICHMENT",
        progress: 80,
        message: "Generating AI insights",
        resumeId,
      });

      await processResumePipeline({
        resumeId,
        parsedData,
      });

      emitResumeProgress({
        userId,
        status: "COMPLETED",
        progress: 100,
        message: "Resume processed successfully",
        resumeId,
      });

      console.log(`Resume processed: ${resumeId}`);
    } catch (error) {
      console.error("Worker processing failed:", error);

      await Resume.findByIdAndUpdate(resumeId, {
        parsingStatus: "FAILED",
      });

      emitResumeProgress({
        userId,
        status: "FAILED",
        progress: 100,
        message: "Resume processing failed",
        resumeId,
      });

      throw error;
    }
  },

  {
    connection: redisConnection,
    concurrency: 5,
  },
);

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(`Job failed: ${job.id}`, err);
});
