const express = require("express");
const auth = require("../middleware/auth");

const { saveResume, getMyResume } = require("../controller/resumeController");

const router = express.Router();

// Get logged in user's resume
router.get("/me", auth, getMyResume);

// Create / Update resume
router.post("/", auth, saveResume);

module.exports = router;
