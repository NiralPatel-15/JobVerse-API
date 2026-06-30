const Job = require("../models/job");
const Application = require("../models/application");


const getRecruiterDashboard = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    // Recruiter jobs
    const jobs = await Job.find({
      recruiter: recruiterId,
    });

    const jobIds = jobs.map((job) => job._id); 

    // Applications
    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("user", "f_name email")
      .populate("job", "title");

    // Stats
    const totalJobs = jobs.length;

    const totalApplicants = applications.length;

    const acceptedCount = applications.filter(
      (app) => app.status === "accepted",
    ).length;

    const rejectedCount = applications.filter(
      (app) => app.status === "rejected",
    ).length;

    const hiredCount = applications.filter(
      (app) => app.status === "hired",
    ).length;

    const offerSentCount = applications.filter(
      (app) => app.status === "offer_sent",
    ).length;

    // Recent applicants
    const recentApplicants = applications
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    res.status(200).json({
      success: true,

      stats: {
        totalJobs,
        totalApplicants,
        acceptedCount,
        rejectedCount,
        hiredCount,
        offerSentCount,
      },

      jobs,

      recentApplicants,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Dashboard fetch failed",
    });
  }
};

module.exports = {
  getRecruiterDashboard,
};