const express = require("express");

const router = express.Router();

const { uploadResume } = require("../config/multerConfig");

const { parseResume } = require("../controllers/resumeController");

const {
  recruiterResumeSearch,
} = require("../controllers/recruiterResumeSearchController");

const {
  uploadResumeController,
} = require("../controllers/uploadResumeController");

router.post("/upload", uploadResume.single("resume"), uploadResumeController);

router.post("/parse", uploadResume.single("resume"), parseResume);

router.get("/search", recruiterResumeSearch);

module.exports = router;
