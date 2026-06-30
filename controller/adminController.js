const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const Job = require("../models/job");
const Application = require("../models/application");

const Report = require("../models/report");

// ==========================================
// ADMIN LOGIN
// ==========================================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // check admin
    const admin = await User.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // role check
    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // token
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_PRIVATE_KEY,
      {
        expiresIn: "7d",
      },
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        f_name: admin.f_name,
        profilePic: admin.profilePic,
      },
    });
  } catch (error) {
    console.log("Admin Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// ADMIN DASHBOARD STATS
// ==========================================
exports.getDashboardStats = async (req, res) => {
  try {
    // total users
    const totalUsers = await User.countDocuments({
      role: "user",
    });

    // recruiters
    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    // jobs
    const totalJobs = await Job.countDocuments();

    // applications
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRecruiters,
        totalJobs,
        totalApplications,
      },
    });
  } catch (error) {
    console.log("Dashboard Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================
exports.getAllUsers = async (req, res) => {
  try {

    // pagination
    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    // search
    const search = req.query.search || "";

    // query
    const query = {
      role: "user",

      $or: [
        {
          f_name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    // users
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // total users
    const totalUsers =
      await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
    });

  } catch (error) {
    console.log("Get Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// BLOCK / UNBLOCK USER
// ==========================================
exports.toggleUserStatus = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.status =
      user.status === "active"
        ? "blocked"
        : "active";

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.status} successfully`,
    });

  } catch (error) {
    console.log("Toggle User Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// DELETE USER
// ==========================================
exports.deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });

  } catch (error) {
    console.log("Delete User Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
 
// ==========================================
// GET ALL RECRUITERS
// ==========================================
exports.getAllRecruiters = async (req, res) => {
  try {

    const recruiters = await User.find({
      role: "recruiter",
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      recruiters,
    });

  } catch (error) {
    console.log("Get Recruiters Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ==========================================
// APPROVE / REJECT RECRUITER
// ==========================================
exports.updateRecruiterStatus =
  async (req, res) => {
    try {

      const { id } = req.params;

      const { recruiterStatus } = req.body;

      const recruiter =
        await User.findById(id);

      if (!recruiter) {
        return res.status(404).json({
          success: false,
          message: "Recruiter not found",
        });
      }

      recruiter.recruiterStatus =
        recruiterStatus;

      await recruiter.save();

      res.status(200).json({
        success: true,
        message:
          "Recruiter status updated",
      });

    } catch (error) {
      console.log(
        "Update Recruiter Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // ==========================================
// GET ALL JOBS (ADMIN)
// ==========================================
exports.getAllJobsAdmin = async (req, res) => {
  try {

    // pagination
    const page = Number(req.query.page) || 1;

    const limit = 10;

    const skip = (page - 1) * limit;

    // search
    const search = req.query.search || "";

    // query
    const { status, classification } = req.query;

    const query = {
      $or: [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          company: {
            $regex: search,
            $options: "i",
          },
        },
        {
          location: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    };

    if (status && status !== "all") {
      query.status = status;
    }

    if (classification && classification !== "all") {
      query["aiModeration.classification"] = classification;
    }

    // jobs
    const jobs = await Job.find(query)
      .populate(
        "recruiter",
        "f_name email profilePic recruiterStatus status"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // total jobs
    const totalJobs =
      await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      jobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs,
    });

  } catch (error) {

    console.log(
      "Get Admin Jobs Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// JOB MODERATION STATS
// ==========================================
exports.getJobModerationStats = async (req, res) => {
  try {
    const [
      totalJobs,
      pendingJobs,
      approvedJobs,
      rejectedJobs,
      safeJobs,
      reviewJobs,
      spamJobs,
    ] = await Promise.all([
      Job.countDocuments(),

      Job.countDocuments({
        status: "pending",
      }),

      Job.countDocuments({
        status: "approved",
      }),

      Job.countDocuments({
        status: "rejected",
      }),

      Job.countDocuments({
        "aiModeration.classification": "Safe",
      }),

      Job.countDocuments({
        "aiModeration.classification": "Needs Review",
      }),

      Job.countDocuments({
        "aiModeration.classification": "Spam",
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalJobs,
        pendingJobs,
        approvedJobs,
        rejectedJobs,
        safeJobs,
        reviewJobs,
        spamJobs,
      },
    });
  } catch (error) {
    console.log("Job Moderation Stats Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// DELETE JOB (ADMIN)
// ==========================================
exports.deleteJobAdmin = async (req, res) => {
  try {

    const { id } = req.params;

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {

    console.log(
      "Delete Job Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// UPDATE JOB STATUS
// ==========================================
exports.updateJobStatusAdmin =
  async (req, res) => {

    try {

      const { id } = req.params;

      const { status } = req.body;

      const job = await Job.findById(id);

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      job.status = status;

      await job.save();

      res.status(200).json({
        success: true,
        message:
          "Job status updated",
      });

    } catch (error) {

      console.log(
        "Update Job Status Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // ==========================================
// GET ALL REPORTS
// ==========================================
exports.getAllReportsAdmin =
  async (req, res) => {

    try {

      const reports =
        await Report.find()

          .populate(
            "reporter",
            "f_name email profilePic"
          )

          .populate(
            "reportedRecruiter",
            "f_name email profilePic"
          )

          .populate(
            "reportedJob",
            "title company"
          )

          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        reports,
      });

    } catch (error) {

      console.log(
        "Get Reports Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // ==========================================
// UPDATE REPORT STATUS
// ==========================================
exports.updateReportStatus =
  async (req, res) => {

    try {

      const { id } = req.params;

      const { status } = req.body;

      const report =
        await Report.findById(id);

      if (!report) {

        return res.status(404).json({
          success: false,
          message: "Report not found",
        });
      }

      report.status = status;

      await report.save();

      res.status(200).json({
        success: true,
        message:
          "Report updated successfully",
      });

    } catch (error) {

      console.log(
        "Update Report Error:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  };

  // ==========================================
// ADMIN LOGOUT
// ==========================================
exports.adminLogout = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log("Admin Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// CHANGE ADMIN PASSWORD
// ==========================================
exports.changeAdminPassword = async (req, res) => {
  try {
    const admin = await User.findById(req.user._id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const isCurrentValid = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isCurrentValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      admin.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message:
          "New password cannot be the same as the current password",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    admin.password = hashedPassword;

    await admin.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}; 