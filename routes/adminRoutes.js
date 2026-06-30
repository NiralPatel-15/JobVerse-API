const express = require("express");

const router = express.Router();

const {
  adminLogin,
  adminLogout,
  changeAdminPassword,
  getDashboardStats,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllRecruiters,
  updateRecruiterStatus,
  getAllJobsAdmin,
  deleteJobAdmin,
  updateJobStatusAdmin,
  getAllReportsAdmin,
  updateReportStatus,
  getJobModerationStats,
} = require("../controller/adminController");

const {
  getTopRecruitersAnalytics,
  getMostAppliedJobs,
} = require("../controller/analyticsController");

const adminAuth = require("../middleware/adminAuth");

const {
  allowRoles,
  allowPermissions,
} = require("../middleware/rbacMiddleware");

const { ROLES } = require("../config/roles");

const { PERMISSIONS } = require("../config/permissions");

// ===============================
// ADMIN LOGIN
// ===============================
router.post("/login", adminLogin);

// ===============================
// ADMIN LOGOUT
// ===============================
router.post("/logout", adminAuth, adminLogout);

// ===============================
// CHANGE PASSWORD
// ===============================
router.put(
  "/change-password",
  adminAuth,
  changeAdminPassword,
);

// ===============================
// ADMIN PROTECTED TEST
// ===============================
router.get("/dashboard", adminAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome Admin",
    admin: req.user,
  });
});

// ==========================================
// ADMIN STATS
// ==========================================
router.get(
  "/stats",
  adminAuth,
  allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  allowPermissions(PERMISSIONS.VIEW_ANALYTICS),
  getDashboardStats,
);

// ==========================================
// USERS
// ==========================================
router.get("/users", adminAuth, getAllUsers);

router.put("/users/:id/status", adminAuth, toggleUserStatus);

router.delete("/users/:id", adminAuth, deleteUser);

// ==========================================
// RECRUITERS
// ==========================================
router.get("/recruiters", adminAuth, getAllRecruiters);

router.put(
  "/recruiters/:id/status",
  adminAuth,
  allowPermissions(PERMISSIONS.APPROVE_RECRUITERS),
  updateRecruiterStatus,
);

// ==========================================
// JOBS
// ==========================================
router.get("/jobs", adminAuth, getAllJobsAdmin);

router.get(
  "/jobs/stats",
  adminAuth,
  allowRoles(ROLES.ADMIN, ROLES.SUPER_ADMIN),
  allowPermissions(PERMISSIONS.MODERATE_JOBS),
  getJobModerationStats,
);

router.delete("/jobs/:id", adminAuth, deleteJobAdmin);

router.put(
  "/jobs/:id/status",
  adminAuth,
  allowPermissions(PERMISSIONS.MODERATE_JOBS),
  updateJobStatusAdmin,
);

// ==========================================
// REPORTS
// ==========================================
router.get("/reports", adminAuth, getAllReportsAdmin);

router.put("/reports/:id/status", adminAuth, updateReportStatus);

// ==========================================
// ANALYTICS
// ==========================================
router.get(
  "/analytics/top-recruiters",
  adminAuth,
  allowPermissions(PERMISSIONS.VIEW_ANALYTICS),
  getTopRecruitersAnalytics,
);

router.get(
  "/analytics/most-applied-jobs",
  adminAuth,
  allowPermissions(PERMISSIONS.VIEW_ANALYTICS),
  getMostAppliedJobs,
);

module.exports = router;
