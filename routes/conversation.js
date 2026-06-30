const express = require("express");
const router = express.Router();
const Authentication = require("../authentication/auth");
const ConversationController = require("../controller/conversation");

// ADD CONVERSATION
router.post(
  "/add-conversation",
  Authentication.auth,
  ConversationController.addConversation,
);

// GET CONVERSATIONS
router.get(
  "/get-conversation",
  Authentication.auth,
  ConversationController.getConversation,
);

module.exports = router;