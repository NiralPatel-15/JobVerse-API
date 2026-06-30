const express = require("express");

const router = express.Router();

const { getRankedCandidates } = require("../controllers/scoring.controller");

router.get("/job/:jobId/rankings", getRankedCandidates);

module.exports = router;
