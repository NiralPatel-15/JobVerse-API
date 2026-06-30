const express = require("express");

const router = express.Router();

const {
  getFlaggedJobs,
  overrideModeration,
} = require("../controller/moderationController");

const auth = require("../middleware/auth");
const adminOnly = require("../middleware/adminAuth");

router.get("/flagged", auth, adminOnly, getFlaggedJobs);

router.post("/override", auth, adminOnly, overrideModeration);

module.exports = router;
