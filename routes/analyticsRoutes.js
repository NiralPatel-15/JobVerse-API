const express = require("express");

const router = express.Router();

const { getPlatformAnalytics } = require("../controller/analyticsController");

const auth = require("../middleware/auth");

const {
  getRecruiterAnalytics,
} = require("../modules/analytics/controllers/analyticsController");

// ==============================
// TEMP ADMIN CHECK
// ==============================

const adminMiddleware = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only",
      });  
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};

// ==============================
// ROUTE
// ==============================

router.get("/platform", getPlatformAnalytics);

router.get("/recruiter/dashboard", auth, getRecruiterAnalytics);

module.exports = router;
