const express = require("express");

const router = express.Router();

const { getScorecard } = require("../controller/scorecardController");

const protect = require("../middleware/auth");

router.get("/:applicationId", protect, getScorecard);

module.exports = router;
