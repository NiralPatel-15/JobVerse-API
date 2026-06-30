const express = require("express");

const router = express.Router();

const auth = require("../../../middleware/auth");

const { getTalentMatches } = require("../controllers/talentMatchController");

router.get("/:jobId", auth, getTalentMatches);

module.exports = router;
