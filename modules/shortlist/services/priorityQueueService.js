const Application = require("../../../models/Application");

const generatePriorityQueue = async (jobId) => {
  const applications = await Application.find({
    job: jobId,
  })
    .populate("user")
    .sort({ createdAt: -1 });

  const queue = applications.map((app) => {
    let priority = "LOW";

    let urgencyScore = 0;

    const reasons = [];

    // Strong ATS score
    if ((app.atsScore || 0) >= 85) {
      urgencyScore += 40;

      reasons.push("Top ATS candidate");
    }

    // Strong interview score
    if ((app.interviewScore || 0) >= 80) {
      urgencyScore += 30;

      reasons.push("Excellent interview performance");
    }

    // Waiting too long
    const daysWaiting = Math.floor(
      (Date.now() - new Date(app.createdAt)) / (1000 * 60 * 60 * 24),
    );

    if (daysWaiting >= 5) {
      urgencyScore += 25;

      reasons.push("Application waiting too long");
    }

    // Not reviewed
    if (app.status === "Applied") {
      urgencyScore += 20;

      reasons.push("Pending recruiter review");
    }

    if (urgencyScore >= 70) {
      priority = "HIGH";
    } else if (urgencyScore >= 40) {
      priority = "MEDIUM";
    }

    return {
      _id: app._id,
      candidate: app.user,
      priority,
      urgencyScore,
      reasons,
      status: app.status,
      atsScore: app.atsScore || 0,
      interviewScore: app.interviewScore || 0,
      createdAt: app.createdAt,
    };
  });

  queue.sort((a, b) => b.urgencyScore - a.urgencyScore);

  return queue;
};

module.exports = {
  generatePriorityQueue,
};
