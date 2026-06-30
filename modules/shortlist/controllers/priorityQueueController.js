const priorityQueueService = require("../services/priorityQueueService");

const getPriorityQueue = async (req, res) => {
  try {
    const { jobId } = req.params;

    const queue = await priorityQueueService.generatePriorityQueue(jobId);

    res.status(200).json({
      success: true,
      queue,
    });
  } catch (error) {
    console.error("Priority queue error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load recruiter queue",
    });
  }
};

module.exports = {
  getPriorityQueue,
};
