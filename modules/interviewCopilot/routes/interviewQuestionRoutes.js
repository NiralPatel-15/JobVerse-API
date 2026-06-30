const express = require("express");

const router = express.Router();

const {
  getInterviewQuestions,
} = require("../controllers/interviewQuestionController");

const auth = require("../../../middleware/auth");

router.get("/:applicationId", auth, getInterviewQuestions);

module.exports = router;
