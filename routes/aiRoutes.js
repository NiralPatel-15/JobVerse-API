const express = require("express");
const router = express.Router();

const {
  improveText,
  recommendJobs,
  reviewResume,
} = require("../controller/aiController");

const auth = require("../middleware/auth");
const resumeUpload = require("../middleware/resumeUpload");

// AI Text Improvement
router.post("/improve", improveText);

// AI Job Recommendations
router.get("/recommend-jobs", auth, recommendJobs);

// AI Resume Review
router.post(
  "/resume-review",
  auth,
  resumeUpload.single("resume"),
  reviewResume,
);

module.exports = router;
