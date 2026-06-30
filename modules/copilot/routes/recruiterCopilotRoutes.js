const express = require("express");

const router = express.Router();

const {
  getRecruiterCopilot,
} = require("../controllers/recruiterCopilotController");

const auth = require("../../../middleware/auth");

router.get("/:applicationId", auth, getRecruiterCopilot);

module.exports = router;
