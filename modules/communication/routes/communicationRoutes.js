const express = require("express");

const router = express.Router();

const controller = require("../controllers/communicationController");

const auth = require("../../../middleware/auth");

router.post("/conversation", controller.createConversation);

router.post("/conversation/get-or-create", controller.getOrCreateConversation);

router.post("/message", controller.sendMessage);

router.get("/messages/:conversationId", controller.getMessages);

router.get("/conversations", controller.getRecruiterConversations);

router.get("/unread-counts", auth, controller.getUnreadCounts);

router.get("/search", auth, controller.searchConversations);
router.patch(
  "/conversations/:conversationId/read",
  auth,
  controller.markConversationRead,
);

router.patch(
  "/messages/:conversationId/seen",
  auth,
  controller.markMessagesSeen,
);

module.exports = router;
