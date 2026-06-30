const Application = require("../../../models/Application");

const getRecruiterDashboardAnalytics = async () => {
  // TOTAL APPLICATIONS
  const totalApplications = await Application.countDocuments();

  // SHORTLISTED
  const shortlisted = await Application.countDocuments({
    status: "shortlisted",
  });

  // INTERVIEWS
  const interviews = await Application.countDocuments({
    status: "interview",
  });

  // HIRED / ACCEPTED
  const hired = await Application.countDocuments({
    status: "accepted",
  });

  // REJECTED
  const rejected = await Application.countDocuments({
    status: "rejected",
  });

  // STATUS DISTRIBUTION
  const statusDistribution = await Application.aggregate([
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // MONTHLY APPLICATIONS
  const monthlyApplications = await Application.aggregate([
    {
      $group: {
        _id: {
          month: {
            $month: "$createdAt",
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.month": 1,
      },
    },
  ]);

  return {
    summary: {
      totalApplications,
      shortlisted,
      interviews,
      hired,
      rejected,
    },

    statusDistribution,

    monthlyApplications,
  };
};

module.exports = {
  getRecruiterDashboardAnalytics,
};
