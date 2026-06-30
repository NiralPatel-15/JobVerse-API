const InterviewSchedule = require("../models/InterviewSchedule");

const createTimelineEvent = require("../utils/createTimelineEvent");

const createNotification = require("../utils/createNotification");
const Application = require("../models/Application");
const { sendEmail } = require("../services/emailService");
const interviewScheduledTemplate = require("../templates/interviewScheduledTemplate");

const scheduleInterview = async (req, res) => {
  try {
    const {
      applicationId,
      panelId,
      round,
      scheduledDate,
      durationMinutes,
      timezone,
      meetingLink,
      notes,
    } = req.body;

    const recruiterId = req.user.id;

    const schedule = await InterviewSchedule.create({
      application: applicationId,
      panel: panelId,
      round,
      scheduledBy: recruiterId,
      scheduledDate,
      durationMinutes,
      timezone,
      meetingLink,
      notes,
    });

    const application = await Application.findById(applicationId)
      .populate("user")
      .populate("job");

    if (application) {
      await Application.findByIdAndUpdate(applicationId, {
        status: "interview",
      });

      await createNotification({
        sender: recruiterId,
        receiver: application.user,

        type: "interviewScheduled",

        title: "Interview Scheduled",

        message: `
${round} Interview Scheduled

Date: ${new Date(scheduledDate).toLocaleString()}

Duration: ${durationMinutes} Minutes

${meetingLink ? `Meeting Link: ${meetingLink}` : ""}

${notes ? `Instructions: ${notes}` : ""}
    `.trim(),

        applicationId,

        redirectUrl: "/interviews",
      });

      try {
        await sendEmail({
          to: application.user.email,

          subject: "Interview Scheduled - JobVerse",

          html: interviewScheduledTemplate({
            candidateName:
              application.user.name ||
              application.user.fullName ||
              application.user.f_name ||
              "Candidate",

            jobTitle: application.job?.title || "Position",

            round,

            scheduledDate: new Date(scheduledDate).toLocaleString(),

            duration: durationMinutes,

            meetingLink,

            notes,
          }),
        });

        console.log("Interview email sent");
      } catch (error) {
        console.error("Interview email failed:", error.message);
      }
    }

    await createTimelineEvent({
      applicationId,
      type: "INTERVIEW_SCHEDULED",
      title: "Interview Scheduled",
      description: `${round} interview scheduled`,
      performedBy: recruiterId,
    });

    const io = req.app.get("io");

    io.to(`application:${applicationId}`).emit("interviewScheduled", schedule);

    io.to(`application:${applicationId}`).emit("timelineUpdated");

    res.status(201).json({
      success: true,
      schedule,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
    });
  }
};

const getInterviewSchedules = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const schedules = await InterviewSchedule.find({
      application: applicationId,
    }).sort({
      scheduledDate: -1,
    });

    res.status(200).json({
      success: true,
      schedules,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch schedules",
    });
  }
};


const getMyInterviews = async (req, res) => {  
  try {

    const applications = await Application.find({
      user: req.user._id,
    });

    const applicationIds = applications.map((app) => app._id);

    const interviews = await InterviewSchedule.find({
      application: { $in: applicationIds },
    })
    
    
      .populate({
        path: "application",
        populate: {
          path: "job",
          select: "title company",
        },
      })
      .sort({
        scheduledDate: -1,
      });

      

    res.status(200).json({
      success: true,
      interviews,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch interviews",
    });
  }
};

const rescheduleInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const { scheduledDate, durationMinutes, meetingLink, notes } = req.body;

    const interview = await InterviewSchedule.findById(id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.scheduledDate = scheduledDate || interview.scheduledDate;
    interview.durationMinutes = durationMinutes || interview.durationMinutes;
    interview.meetingLink = meetingLink || interview.meetingLink;
    interview.notes = notes || interview.notes;
    interview.status = "Rescheduled";

    await interview.save();

    const application = await Application.findById(
      interview.application,
    ).populate("user");

    if (application) {
      await createNotification({
        sender: req.user.id,
        receiver: application.user,

        type: "interviewRescheduled",

        title: "Interview Rescheduled",

        message: `
Interview Rescheduled

New Date: ${new Date(interview.scheduledDate).toLocaleString()}

Duration: ${interview.durationMinutes} Minutes

${interview.meetingLink ? `Meeting Link: ${interview.meetingLink}` : ""}

${interview.notes ? `Instructions: ${interview.notes}` : ""}
        `.trim(),

        applicationId: application._id,

        redirectUrl: "/interviews",
      });

      try {
        await sendEmail({
          to: application.user.email,
          subject: "Interview Rescheduled - JobVerse",
          html: `
      <h2>Interview Rescheduled</h2>
      <p>Hello ${application.user.f_name},</p>

      <p>Your interview has been rescheduled.</p>

      <ul>
        <li>Date: ${new Date(interview.scheduledDate).toLocaleString()}</li>
        <li>Duration: ${interview.durationMinutes} Minutes</li>
      </ul>

      ${
        interview.meetingLink
          ? `<p><a href="${interview.meetingLink}">Join Interview</a></p>`
          : ""
      }

      ${interview.notes ? `<p>Instructions: ${interview.notes}</p>` : ""}
    `,
        });
      } catch (error) {
        console.error("Reschedule email failed:", error.message);
      }
    }

    await createTimelineEvent({
      applicationId: interview.application,

      type: "INTERVIEW_RESCHEDULED",

      title: "Interview Rescheduled",

      description: "Interview date updated",

      performedBy: req.user.id,
    });

    const io = req.app.get("io");

    io.to(`application:${interview.application}`).emit(
      "interviewRescheduled",
      interview,
    );

    io.to(`application:${interview.application}`).emit("timelineUpdated");

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to reschedule interview",
    });
  }
};

const cancelInterview = async (req, res) => {
  try {
    const interview = await InterviewSchedule.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.status = "Cancelled";

    await interview.save();

    const application = await Application.findById(
      interview.application,
    ).populate("user");

    if (application) {
      await createNotification({
        sender: req.user.id,
        receiver: application.user,

        type: "interviewCancelled",

        title: "Interview Cancelled",

        message: "Your interview has been cancelled",

        applicationId: application._id,

        redirectUrl: "/interviews",
      });

      try {
  await sendEmail({
    to: application.user.email,

    subject: "Interview Cancelled - JobVerse",

    html: `
      <h2>Interview Cancelled</h2>

      <p>Hello ${application.user.f_name},</p>

      <p>
        Your scheduled interview has been cancelled.
      </p>

      <p>
        Please wait for further communication from the recruiter.
      </p>

      <br>

      <p>JobVerse Team</p>
    `,
  });
} catch (error) {
  console.error(error);
}
    }

    await createTimelineEvent({
      applicationId: interview.application,

      type: "INTERVIEW_CANCELLED",

      title: "Interview Cancelled",

      description: "Interview cancelled by recruiter",

      performedBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Cancel email failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to cancel interview",
    });
  }
};

const completeInterview = async (req, res) => {
  try {
    const interview = await InterviewSchedule.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    interview.status = "Completed";

    await interview.save();

    const application = await Application.findById(
      interview.application,
    ).populate("user");

    if (application) {
      await createNotification({
        sender: req.user.id,
        receiver: application.user,

        type: "interviewCompleted",

        title: "Interview Completed",

        message: "Your interview has been marked completed",

        applicationId: application._id,

        redirectUrl: "/interviews",
      });
    }

    await createTimelineEvent({
      applicationId: interview.application,

      type: "INTERVIEW_COMPLETED",

      title: "Interview Completed",

      description: "Interview completed",

      performedBy: req.user.id,
    });

    res.status(200).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to complete interview",
    });
  }
};

module.exports = {
  scheduleInterview,
  getInterviewSchedules,
  getMyInterviews,
  rescheduleInterview,
  cancelInterview,
  completeInterview,
};