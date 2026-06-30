const InterviewFeedback = require("../models/InterviewFeedback");

const createTimelineEvent = require("../utils/createTimelineEvent");

const createNotification = require("../utils/createNotification");
const calculateHiringScorecard = require("../utils/calculateHiringScorecard");

const createInterviewFeedback = async (req, res) => {
  try {
    const {
      applicationId,
      interviewRound,
      feedback,
      strengths,
      weaknesses,
      scores,
      recommendation,
    } = req.body;

    const recruiterId = req.user.id;

    const newFeedback = await InterviewFeedback.create({
      application: applicationId,
      interviewRound,
      interviewer: recruiterId,
      feedback,
      strengths,
      weaknesses,
      scores,
      recommendation,
    });

    await createTimelineEvent({
      applicationId,
      type: "INTERVIEW_FEEDBACK_ADDED",
      title: "Interview Feedback Added",
      description: `${interviewRound} interview feedback submitted`,
      performedBy: recruiterId,
    });

    await createNotification({
      recipient: recruiterId,
      type: "INTERVIEW_FEEDBACK",
      title: "Interview Feedback Submitted",
      message: `Feedback submitted successfully`,
      redirectUrl: `/recruiter/applications/${applicationId}`,
    });
    

    const io = req.app.get("io");

    io.to(`application:${applicationId}`).emit(
      "interviewFeedbackCreated",
      newFeedback,
    );

    io.to(`application:${applicationId}`).emit("timelineUpdated");

    res.status(201).json({
      success: true,
      feedback: newFeedback,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create feedback",
    });
  }
};

module.exports = {
  createInterviewFeedback,
};
