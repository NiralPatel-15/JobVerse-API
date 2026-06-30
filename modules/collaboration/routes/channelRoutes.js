const express = require("express");

const router = express.Router();

const {
  createChannel,
  getChannels,
  getChannelById,
  joinChannel,
  leaveChannel,
  getChannelMembers,
  addMember,
  removeMember,
  searchRecruiters,
} = require("../controllers/channelController");

const auth = require("../../../middleware/auth");

router.post("/", auth, createChannel);

router.get("/", auth, getChannels);

/*
  IMPORTANT:
  search-recruiters MUST come before /:id
*/
router.get("/search-recruiters", auth, searchRecruiters);

router.get("/:id", auth, getChannelById);

router.post("/:id/join", auth, joinChannel);

router.post("/:id/leave", auth, leaveChannel);

router.get("/:id/members", auth, getChannelMembers);

router.post("/:id/add-member", auth, addMember);

router.post("/:id/remove-member", auth, removeMember);

module.exports = router;
