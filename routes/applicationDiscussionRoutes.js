const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");

const {
  addDiscussion,
  getDiscussions,
  addReply,
} = require("../controller/applicationDiscussionController");

router.post("/", protect, addDiscussion);

router.get("/:applicationId", protect, getDiscussions);

router.post("/reply/:discussionId", protect, addReply);

module.exports = router;
