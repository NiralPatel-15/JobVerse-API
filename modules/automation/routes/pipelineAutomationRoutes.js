const express = require("express");

const router = express.Router();

const {
  getPipelineAutomation,
  applyPipelineAutomation,
} = require("../controllers/pipelineAutomationController");

router.get("/:applicationId", getPipelineAutomation);

router.post("/apply/:applicationId", applyPipelineAutomation);

module.exports = router;
