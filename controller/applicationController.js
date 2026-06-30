const Application = require("../models/application");
const Job = require("../models/job");
const NotificationModel = require("../models/notification");
const ApplicationTimeline = require("../models/applicationTimeline");
const socketManager = require("../socket");

// ✅ UPDATE STATUS
const STATUS_CONFIG = require("../utils/applicationStatusConfig");
const createNotification = require("../utils/createNotification");
const createTimelineEvent = require("../utils/createTimelineEvent");
const { emitTimelineUpdate } = require("../utils/socketEvents");
const { extractResumeText } = require("../services/resumeTextExtractor");
const { scoreCandidate } = require("../services/ai/candidateScoringEngine");
const { sendEmail } = require("../services/emailService");
const applicationSubmittedTemplate = require("../templates/applicationSubmittedTemplate");

// ✅ APPLY JOB
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // ✅ CHECK EXISTING APPLICATION
    const existing = await Application.findOne({
      user: req.user._id,
      job: jobId,
    });

    if (existing) {
      return res.status(400).json({
        msg: "Already applied!",
      });
    }

    // ✅ CHECK RESUME
    if (!req.file) {
      return res.status(400).json({
        msg: "Resume PDF required",
      });
    }

    // ✅ FIND JOB
    const job = await Job.findById(jobId).populate("recruiter", "_id");

    if (!job) {
      return res.status(404).json({
        msg: "Job not found",
      });
    }

    // ✅ RESUME URL
    const resumeUrl = `http://localhost:4000/uploads/resumes/${req.file.filename}`;

    // ====================================
    // EXTRACT RESUME TEXT
    // ====================================

    const resumeText = await extractResumeText(req.file);

    // ====================================
    // ATS SCORING
    // ====================================

    const scoringResult = scoreCandidate({
      resumeText,
      jobSkills: job.skills || [],
      experienceYears: 0,
    });

    // ====================================
    // CREATE APPLICATION WITH ATS DATA
    // ====================================

    const application = await Application.create({
      user: req.user._id,
      job: jobId,
      resume: resumeUrl,

      resumeText,

      atsScore: scoringResult.overallScore,

      skillsScore: scoringResult.skillMatchScore,

      experienceScore: scoringResult.experienceScore,

      resumeQualityScore: scoringResult.keywordScore,

      matchedSkills: scoringResult.matchedSkills,

      missingSkills: scoringResult.missingSkills,

      strengths: scoringResult.aiInsights,

      weaknesses: scoringResult.missingSkills.map(
        (skill) => `Missing skill: ${skill}`,
      ),

      atsReasoning: scoringResult.aiInsights.join("\n"),
    });

    // ========================================
    // CREATE TIMELINE EVENT
    // ========================================

    const timeline = await createTimelineEvent({
      applicationId: application._id,

      actor: req.user._id,

      type: "applied",

      title: "Application Submitted",

      description: `${req.user.f_name} applied for this job`,
    });

    emitTimelineUpdate(application._id, timeline);

    // ==================================================
    // ✅ CREATE NOTIFICATION
    // ==================================================

    const notification = await createNotification({
      sender: req.user._id,

      receiver: job.recruiter._id,

      type: "jobApplication",

      title: "New Job Application",

      message: `${req.user.f_name} applied for ${job.title}`,

      action: "application_received",

      jobId: job._id,

      applicationId: application._id,
    });

    try {
      await sendEmail({
        to: req.user.email,

        subject: "Application Submitted - JobVerse",

        html: applicationSubmittedTemplate({
          candidateName: req.user.f_name,

          jobTitle: job.title,
        }),
      });

      console.log("Application email sent");
    } catch (error) {
      console.error("Application email failed:", error.message);
    }

    // ==================================================
    // ✅ REALTIME SOCKET NOTIFICATION
    // ==================================================

    socketManager
      .getIO()
      .to(job.recruiter._id.toString())
      .emit("newNotification", {
        _id: notification._id,

        sender: {
          _id: req.user._id,

          f_name: req.user.f_name,

          profilePic: req.user.profilePic,
        },

        type: "jobApplication",

        title: notification.title,

        message: notification.message,

        action: notification.action,

        jobId: notification.jobId,

        applicationId: notification.applicationId,

        redirectUrl: notification.redirectUrl,

        createdAt: notification.createdAt,

        isRead: false,
      });

    // ==================================================
    // ✅ RESPONSE
    // ==================================================

    res.status(201).json({
      success: true,
      application,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: err.message,
    });
  }
};

// ✅ GET MY APPLICATIONS
exports.getMyApplications = async (req, res) => {
  try {
    // ✅ ONLY USERS
    if (req.user.role !== "user") {
      return res.status(403).json({
        msg: "Only users allowed",
      });
    }

    const apps = await Application.find({
      user: req.user._id,
    }).populate("job");

    res.json(apps);
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

// ✅ GET APPLICANTS
exports.getApplicants = async (req, res) => {
  try {
    const apps = await Application.find({
      job: req.params.jobId,
    })
      .populate("user", "f_name email profilePic")
      .populate("job");

    // ✅ HANDLE EMPTY
    if (!apps.length) {
      return res.json([]);
    }

    // ✅ CHECK OWNER
    if (apps[0].job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Not authorized",
      });
    }

    res.json(apps);
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ================================
    // VALIDATE STATUS
    // ================================

    const allowedStatuses = [
      "shortlisted",
      "rejected",
      "interview",
      "accepted",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        msg: "Invalid status",
      });
    }

    // ================================
    // FIND APPLICATION
    // ================================

    const app = await Application.findById(req.params.id)
      .populate("job")
      .populate("user", "f_name profilePic");

    if (!app) {
      return res.status(404).json({
        msg: "Application not found",
      });
    }

    // ================================
    // CHECK RECRUITER OWNER
    // ================================

    if (app.job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        msg: "Not authorized",
      });
    }

    // ================================
    // UPDATE STATUS
    // ================================

    app.status = status;

    await app.save();

    // ========================================
    // CREATE TIMELINE EVENT
    // ========================================

    const timeline = await createTimelineEvent({
      applicationId: app._id,

      actor: req.user._id,

      type: status,

      title: `Application ${status}`,

      description: `${req.user.f_name} updated application status to ${status}`,
    });

    emitTimelineUpdate(app._id, timeline);


    // ================================
    // STATUS CONFIG
    // ================================

    const statusData = STATUS_CONFIG[status];

    // ================================
    // CREATE NOTIFICATION
    // ================================

    const notification = await createNotification({
      sender: req.user._id,

      receiver: app.user._id,

      type: "applicationStatus",

      title: statusData.title,

      message: `${statusData.message} (${app.job.title})`,

      action: status,

      jobId: app.job._id,

      applicationId: app._id,

      metadata: {
        status,
      },
    });

    // ================================
    // REALTIME SOCKET EVENT
    // ================================

    socketManager
      .getIO()
      .to(app.user._id.toString())
      .emit("newNotification", {
        _id: notification._id,

        sender: {
          _id: req.user._id,

          f_name: req.user.f_name,

          profilePic: req.user.profilePic,
        },

        type: "applicationStatus",

        title: statusData.title,

        message: `${statusData.message} (${app.job.title})`,

        action: status,

        jobId: app.job._id,

        applicationId: app._id,

        metadata: {
          status,
        },

        createdAt: notification.createdAt,

        isRead: false,

        redirectUrl: notification.redirectUrl,
      });

    // ================================
    // RESPONSE
    // ================================

    res.status(200).json({
      success: true,

      msg: "Application status updated",

      application: app,
    });
  } catch (err) {
    console.log("UPDATE STATUS ERROR:", err);

    res.status(500).json({
      msg: err.message,
    });
  }
};

exports.getApplicationDetails = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("user", "f_name email profilePic");

    if (!application) {
      return res.status(404).json({
        msg: "Application not found",
      });
    }

    // SECURITY
    const isOwner = application.user._id.toString() === req.user._id.toString();

    const isRecruiter =
      application.job.recruiter.toString() === req.user._id.toString();

    if (!isOwner && !isRecruiter) {
      return res.status(403).json({
        msg: "Unauthorized",
      });
    }

    // ================================
    // GET TIMELINE
    // ================================

    const timeline = await ApplicationTimeline.find({
      application: req.params.id,
    })
      .populate("actor", "f_name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      application,
      timeline,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};

exports.getApplicationTimeline = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("user");

    if (!application) {
      return res.status(404).json({
        msg: "Application not found",
      });
    }

    // ======================================
    // SECURITY
    // ======================================

    const isOwner = application.user._id.toString() === req.user._id.toString();

    const isRecruiter =
      application.job.recruiter.toString() === req.user._id.toString();

    if (!isOwner && !isRecruiter) {
      return res.status(403).json({
        msg: "Unauthorized",
      });
    }

    // ======================================
    // GET TIMELINE
    // ======================================

    const timeline = await ApplicationTimeline.find({
      application: req.params.id,
    })
      .populate("actor", "f_name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      timeline,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
    });
  }
};