const Resume = require("../models/Resume");

const resumeQueue = require("../queues/resumeQueue");

const { emitResumeProgress } = require("../socket/resumeSocketEvents");

const uploadResumeController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Resume required",
      });
    }

    const userId = req.user?._id || "guest";

    const resume = await Resume.create({
      candidate: userId,

      originalFileName: req.file.originalname,

      fileUrl: req.file.path,

      mimeType: req.file.mimetype,

      parsingStatus: "PROCESSING",
    });

    emitResumeProgress({
      userId,
      status: "QUEUED",
      progress: 10,
      message: "Resume added to processing queue",
      resumeId: resume._id,
    });

    await resumeQueue.add(
      "process-resume",
      {
        resumeId: resume._id,

        filePath: req.file.path,

        userId,
      },

      {
        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 5000,
        },

        removeOnComplete: true,
      },
    );

    return res.status(201).json({
      success: true,

      message: "Resume queued for processing",

      resumeId: resume._id,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Resume upload failed",
    });
  }
};

module.exports = {
  uploadResumeController,
};
