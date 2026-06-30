const express = require("express");

const router = express.Router();

const auth = require("../../../middleware/auth");

const { getPriorityQueue } = require("../controllers/priorityQueueController");

router.get("/:jobId", auth, getPriorityQueue);

module.exports = router;
