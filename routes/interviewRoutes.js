const express = require("express");

const router = express.Router();

const {
  createInterviewFeedback,
} = require("../controller/interviewController");

const protect = require("../middleware/auth");

const recruiterOnly = require("../middleware/authRecruiter");

router.post("/feedback", protect, recruiterOnly, createInterviewFeedback);

module.exports = router;
