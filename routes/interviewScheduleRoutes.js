const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const recruiterOnly = require("../middleware/authRecruiter");

const {
  scheduleInterview,
  getInterviewSchedules,
  getMyInterviews,
  rescheduleInterview,
  cancelInterview,
  completeInterview,
} = require("../controller/interviewScheduleController");

router.post("/schedule", protect, recruiterOnly, scheduleInterview);

router.get("/my-interviews", protect, getMyInterviews);
router.get("/:applicationId", protect, recruiterOnly, getInterviewSchedules);
router.put("/:id/reschedule", protect, recruiterOnly, rescheduleInterview);
router.put("/:id/cancel", protect, recruiterOnly, cancelInterview);

router.put("/:id/complete", protect, recruiterOnly, completeInterview);


module.exports = router;
