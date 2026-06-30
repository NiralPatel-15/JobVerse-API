const express = require("express");

const router = express.Router();

const { getRecruiterAnalytics } = require("../controllers/analyticsController");

const authMiddleware = require("../../../middlewares/authMiddleware");

router.get("/recruiter/dashboard", authMiddleware, getRecruiterAnalytics);

module.exports = router;
