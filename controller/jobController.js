const Job = require("../models/job");
const User = require("../models/user");
const analyzeJobContent = require("../utils/analyzeJobContent");
// ✅ CREATE JOB (RECRUITER ONLY)

// ✅ CREATE JOB
// ✅ CREATE JOB
// ✅ CREATE JOB
exports.createJob = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    console.log("FILE:", req.file);

    console.log("USER:", req.user);

    // ======================================
    // CHECK USER
    // ======================================

    if (
      !req.user ||
      req.user.role !== "recruiter"
    ) {
      return res.status(403).json({
        msg: "Only recruiters allowed",
      });
    }

    // ======================================
    // CHECK RECRUITER APPROVAL
    // ======================================

    const recruiter = await User.findById(
      req.user._id
    );

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        msg: "Recruiter not found",
      });
    }

    // recruiter blocked

    if (
      recruiter.status === "blocked"
    ) {
      return res.status(403).json({
        success: false,
        msg:
          "Your account has been blocked by admin",
      });
    }

    // recruiter not approved

    if (
      recruiter.recruiterStatus !==
      "approved"
    ) {
      return res.status(403).json({
        success: false,
        msg:
          "Your recruiter account is pending admin approval",
      });
    }

    // ======================================
    // REQUEST DATA
    // ======================================

    const {
      title,
      company,
      description,
      location,
      salary,
      experience,
      jobType,
      workMode,
    } = req.body;

    // ======================================
    // IMAGE URL
    // ======================================

    let imageUrl =
      "https://img.freepik.com/free-vector/job-interview-conversation_74855-7566.jpg";

    if (req.file) {
      imageUrl =
        `http://localhost:4000/uploads/jobs/${req.file.filename}`;
    }

    // ======================================
    // AI MODERATION
    // ======================================

    const moderationResult =
      analyzeJobContent(
        title,
        description
      );

    console.log(
      "AI MODERATION:",
      moderationResult
    );

    // ======================================
    // CREATE JOB
    // ======================================

    const job = await Job.create({
      title,

      company,

      description,

      location,

      salary,

      experience,

      jobType,

      workMode,

      skills: req.body.skills
        ? JSON.parse(req.body.skills)
        : [],

      image: imageUrl,

      recruiter: req.user._id,

      aiModeration: moderationResult,
    });

    res.status(201).json({
      success: true,

      msg: "Job posted successfully",

      moderation:
        moderationResult,

      job,
    });
  } catch (err) {
    console.log(
      "CREATE JOB ERROR:",
      err
    );

    res.status(500).json({
      success: false,

      msg: err.message,
    });
  }
};

// ✅ GET ALL JOBS
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      status: "approved",
    })
      .populate("recruiter", "f_name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};

// ✅ GET SINGLE JOB
exports.getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  res.json(job);
};

// GET RECRUITER JOBS FOR PROFILE
exports.getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      recruiter: req.params.id,
      status: "approved",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      msg: err.message,
    });
  }
};
