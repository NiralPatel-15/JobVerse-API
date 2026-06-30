const InterviewPanel = require("../models/InterviewPanel");

const createTimelineEvent = require("../utils/createTimelineEvent");

const assignInterviewPanel = async (req, res) => {
  try {
    const { applicationId, round, panelMembers, scheduledDate, meetingLink } =
      req.body;

    const panel = await InterviewPanel.findOneAndUpdate(
      {
        application: applicationId,
      },
      {
        application: applicationId,
        round,
        panelMembers,
        scheduledDate,
        meetingLink,
      },
      {
        new: true,
        upsert: true,
      },
    );

    await createTimelineEvent({
      applicationId,
      type: "INTERVIEW_PANEL_ASSIGNED",
      title: "Interview Panel Assigned",
      description: `${round} panel assigned`,
      performedBy: req.user.id,
    });

    const io = req.app.get("io");

    io.to(`application:${applicationId}`).emit("panelUpdated", panel);

    io.to(`application:${applicationId}`).emit("timelineUpdated");

    res.status(200).json({
      success: true,
      panel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to assign interview panel",
    });
  }
};

const getInterviewPanel = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const panel = await InterviewPanel.findOne({
      application: applicationId,
    }).populate("panelMembers.recruiter", "name email");

    res.status(200).json({
      success: true,
      panel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interview panel",
    });
  }
};

module.exports = {
  assignInterviewPanel,
  getInterviewPanel,
};