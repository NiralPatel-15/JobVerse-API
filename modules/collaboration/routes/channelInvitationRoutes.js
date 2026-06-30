const express = require("express");

const router = express.Router();

const auth = require("../../../middleware/auth");

const {
  sendInvitation,
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation,
} = require("../controllers/channelInvitationController");

router.post("/", auth, sendInvitation);

router.get("/pending", auth, getPendingInvitations);

router.post("/:id/accept", auth, acceptInvitation);

router.post("/:id/reject", auth, rejectInvitation);

module.exports = router;
