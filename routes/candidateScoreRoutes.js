const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const authRecruiter = require("../middleware/authRecruiter");

const {
  generateCandidateScore,
  getCandidateScore,
} = require("../controller/candidateScoreController");

router.post(
  "/generate/:applicationId",
  auth,
  authRecruiter,
  generateCandidateScore,
);

router.get("/:applicationId", auth, authRecruiter, getCandidateScore);

module.exports = router;
