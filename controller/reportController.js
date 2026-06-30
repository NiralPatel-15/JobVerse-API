const Report = require("../models/report");

// ==========================================
// CREATE REPORT
// ==========================================
exports.createReport = async (req, res) => {
  try {
    const { reportedJob, reportedRecruiter, reason, description } = req.body;

    const report = await Report.create({
      reporter: req.user._id,
      reportedJob,
      reportedRecruiter,
      reason,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report,
    });
  } catch (error) {
    console.log("Create Report Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
