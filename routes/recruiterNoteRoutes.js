const express = require("express");

const router = express.Router();

const {
  createRecruiterNote,
  getRecruiterNotes,
} = require("../controller/recruiterNoteController");

// ✅ FIX THIS IMPORT
const recruiterAuth = require("../middleware/authRecruiter");

router.post("/:applicationId", recruiterAuth, createRecruiterNote);

router.get("/:applicationId", recruiterAuth, getRecruiterNotes);

module.exports = router;
