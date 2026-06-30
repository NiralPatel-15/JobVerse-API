const analyticsService = require("../services/analyticsService");

const getRecruiterAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getRecruiterDashboardAnalytics();

    return res.status(200).json({
      success: true,
      analytics,
    });
  } catch (error) {
    console.error("Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};

module.exports = {
  getRecruiterAnalytics,
};
