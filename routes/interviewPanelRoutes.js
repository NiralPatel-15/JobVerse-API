const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const recruiterOnly = require("../middleware/authRecruiter");

const {
  assignInterviewPanel,
  getInterviewPanel,
} = require("../controller/interviewPanelController");

router.post("/assign", protect, recruiterOnly, assignInterviewPanel);

router.get("/:applicationId", protect, recruiterOnly, getInterviewPanel);

module.exports = router;
