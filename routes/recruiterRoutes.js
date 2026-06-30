const express = require("express");

const router = express.Router();

const { getRecruiterDashboard } = require("../controller/recruiterController");

const protect = require("../middleware/auth");

router.get("/dashboard", protect, getRecruiterDashboard);

module.exports = router;
