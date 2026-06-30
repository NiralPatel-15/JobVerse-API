const ModerationLog = require("../models/ModerationLog");
const Job = require("../models/job");

exports.getFlaggedJobs = async (req, res) => {
  try {
    const logs = await ModerationLog.find({
      action: "FLAGGED",
    })
      .populate("job recruiter")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.overrideModeration = async (req, res) => {
  try {
    const { jobId, action } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    job.moderationStatus = action;

    await job.save();

    await ModerationLog.create({
      recruiter: job.createdBy,
      job: job._id,
      action: "MANUAL_OVERRIDE",
      moderatedBy: req.user.id,
      reason: `Admin override: ${action}`,
    });

    req.io.to(`recruiter_${job.createdBy}`).emit("moderationUpdated", {
      jobId: job._id,
      status: action,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
