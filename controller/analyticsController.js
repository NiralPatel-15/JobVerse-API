const User = require("../models/user");
const Job = require("../models/job");
const Report = require("../models/report");
const Application = require("../models/application");

// ======================================================
// PLATFORM ANALYTICS
// ======================================================

exports.getPlatformAnalytics = async (req, res) => {
  try {
    // ==============================
    // BASIC STATS
    // ==============================

    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalRecruiters = await User.countDocuments({
      role: "recruiter",
    });

    const approvedRecruiters = await User.countDocuments({
      role: "recruiter",
      recruiterStatus: "approved",
    });

    const totalJobs = await Job.countDocuments();

    const approvedJobs = await Job.countDocuments({
      status: "approved",
    });

    const pendingJobs = await Job.countDocuments({
      status: "pending",
    });

    const totalReports = await Report.countDocuments();

    const pendingReports = await Report.countDocuments({
      status: "pending",
    });

    const totalApplications = await Application.countDocuments();

    // ==============================
    // MONTHLY USER GROWTH
    // ==============================

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          users: { $sum: 1 },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // ==============================
    // MONTHLY JOB GROWTH
    // ==============================

    const jobGrowth = await Job.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },

          jobs: { $sum: 1 },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // ==============================
    // MONTHLY APPLICATIONS
    // ==============================

    const monthlyApplications = await Application.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },

          applications: { $sum: 1 },
        },
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    // ==============================
    // REPORT STATS
    // ==============================

    const reportStats = await Report.aggregate([
      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    // ==============================
    // JOB STATUS STATS
    // ==============================

    const jobStatusStats = await Job.aggregate([
      {
        $group: {
          _id: "$status",

          count: {
            $sum: 1,
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,

      stats: {
        totalUsers,
        totalRecruiters,
        approvedRecruiters,
        totalJobs,
        approvedJobs,
        pendingJobs,
        totalReports,
        pendingReports,
        totalApplications,
      },

      userGrowth,
      jobGrowth,
      monthlyApplications,
      reportStats,
      jobStatusStats,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Analytics fetch failed",
    });
  }
};

// ======================================================
// TOP RECRUITERS ANALYTICS
// ======================================================

const getTopRecruitersAnalytics = async (req, res) => {
  try {
    const recruiters = await Job.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "job",
          as: "applications",
        },
      },

      {
        $group: {
          _id: "$recruiter",
          totalJobs: { $sum: 1 },
          totalApplications: {
            $sum: {
              $size: "$applications",
            },
          },
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "recruiter",
        },
      },

      {
        $unwind: "$recruiter",
      },

      {
        $project: {
          recruiterName: {
            $trim: {
              input: {
                $concat: [
                  "$recruiter.f_name",
                  " ",
                  { $ifNull: ["$recruiter.l_name", ""] },
                ],
              },
            },
          },
          recruiterEmail: "$recruiter.email",
          recruiterAvatar: "$recruiter.profilePic",
          totalJobs: 1,
          totalApplications: 1,
        },
      },

      {
        $sort: {
          totalApplications: -1,
          totalJobs: -1,
        },
      },

      {
        $limit: 10,
      },
    ]);

    // console.log("Top Recruiters:", recruiters);

    res.status(200).json(recruiters);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch recruiter analytics",
    });
  }
};

module.exports.getTopRecruitersAnalytics = getTopRecruitersAnalytics;

const getMostAppliedJobs = async (req, res) => {
  try {
    const jobs = await Application.aggregate([
      {
        $group: {
          _id: "$job",

          totalApplications: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          totalApplications: -1,
        },
      },

      {
        $limit: 10,
      },

      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },

      {
        $unwind: "$job",
      },

      {
        $project: {
          jobTitle: "$job.title",
          company: "$job.company",
          location: "$job.location",
          totalApplications: 1,
          salary: "$job.salary",
          status: "$job.status",
        },
      },
    ]);

    res.status(200).json(jobs);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch most applied jobs",
    });
  }
};

module.exports.getMostAppliedJobs = getMostAppliedJobs;