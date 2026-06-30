const express = require("express");

const router = express.Router();

const { createReport } = require("../controller/reportController");

// ⚠️ IMPORTANT
// USE YOUR REAL AUTH MIDDLEWARE FILE NAME

const authMiddleware = require("../middleware/auth");

// or if your file is:
// require("../middleware/authMiddleware");

router.post("/create", authMiddleware, createReport);

module.exports = router;
