const express = require("express");
const router = express.Router();
const Authentication = require("../authentication/auth");
const MessageController = require("../controller/message");

// Send Message
router.post("/", Authentication.auth, MessageController.sendMessage);

// Get Messages by Conversation ID
router.get("/:convId", Authentication.auth, MessageController.getMessage);

module.exports = router;
