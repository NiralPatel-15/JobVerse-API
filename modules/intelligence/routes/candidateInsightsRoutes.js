const express = require("express");

const router = express.Router();

const {
  getCandidateInsights,
} = require("../controllers/candidateInsightsController");

// FIXED PATH
const auth = require("../../../middleware/auth");

router.get("/:applicationId", auth, getCandidateInsights);

module.exports = router;
