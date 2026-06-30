const express = require("express");

const router = express.Router();

const auth = require("../../../middleware/auth");

const {
  getChannelMessages,
} = require("../controllers/channelMessageController");

router.get("/:channelId", auth, getChannelMessages);

module.exports = router;
