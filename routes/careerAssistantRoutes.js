const express = require("express");
const router = express.Router();

const {
  chatAssistant,
  recommendJobs,
  resumeReview,
  generateInterviewQuestions,
  careerGuidance,
} = require("../controller/careerAssistantController");

const authMiddleware = require("../middleware/auth");

router.post("/chat", authMiddleware, chatAssistant);

router.get("/recommend-jobs", authMiddleware, recommendJobs);

router.post("/resume-review", authMiddleware, resumeReview);

router.post("/interview-questions", authMiddleware, generateInterviewQuestions);

router.get("/career-guidance", authMiddleware, careerGuidance);

module.exports = router;
