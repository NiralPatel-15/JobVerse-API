const ApplicationDiscussion = require("../models/ApplicationDiscussion");

const extractMentions = require("../utils/extractMentions");

const createNotification = require("../utils/createNotification");

// =====================================
// ADD DISCUSSION
// =====================================

const addDiscussion = async (req, res) => {
  try {
    const { applicationId, message } = req.body;

    const mentions = await extractMentions(message);

    const discussion = await ApplicationDiscussion.create({
      application: applicationId,

      sender: req.user._id,

      message,

      mentions,
    });

    const populatedDiscussion = await ApplicationDiscussion.findById(
      discussion._id,
    ).populate("sender", "f_name profilePic role");

    // =====================================
    // CREATE MENTION NOTIFICATIONS
    // =====================================

    for (const mentionedUserId of mentions) {
      await createNotification({
        recipient: mentionedUserId,

        sender: req.user._id,

        type: "mention",

        title: "You were mentioned",

        message: `${req.user.f_name} mentioned you in recruiter discussion`,

        redirectUrl: `/recruiter/workspace/${applicationId}`,
      });
    }

    // =====================================
    // REALTIME EVENT
    // =====================================

    const io = req.app.get("io");

    io.to(`application_${applicationId}`).emit(
      "discussionAdded",
      populatedDiscussion,
    );
    

    res.status(201).json({
      success: true,
      discussion: populatedDiscussion,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to add discussion",
    });
  }
};

// =====================================
// GET DISCUSSIONS
// =====================================

const getDiscussions = async (req, res) => {
  try {
    const discussions = await ApplicationDiscussion.find({
      application: req.params.applicationId,
    })
      .populate("sender", "f_name profilePic role")
      .populate("replies.sender", "f_name profilePic role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      discussions,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch discussions",
    });
  }
};

// =====================================
// ADD REPLY
// =====================================

const addReply = async (req, res) => {
  try {
    const { message } = req.body;

    const discussion = await ApplicationDiscussion.findById(
      req.params.discussionId,
    );

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    const mentions = await extractMentions(message);

    discussion.replies.push({
      sender: req.user._id,

      message,

      mentions,
    });

    await discussion.save();

    const updatedDiscussion = await ApplicationDiscussion.findById(
      discussion._id,
    )
      .populate("sender", "f_name profilePic role")
      .populate("replies.sender", "f_name profilePic role");

    // =====================================
    // CREATE MENTION NOTIFICATIONS
    // =====================================

    for (const mentionedUserId of mentions) {
      await createNotification({
        recipient: mentionedUserId,

        sender: req.user._id,

        type: "mention",

        title: "You were mentioned in reply",

        message: `${req.user.f_name} mentioned you in a reply`,

        redirectUrl: `/recruiter/workspace/${discussion.application}`,
      });
    }

    // =====================================
    // REALTIME EVENT
    // =====================================

    const io = req.app.get("io");

    io.to(`application_${discussion.application}`).emit(
      "discussionReplyAdded",
      updatedDiscussion,
    );

    res.status(200).json({
      success: true,
      discussion: updatedDiscussion,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to add reply",
    });
  }
};

module.exports = {
  addDiscussion,
  getDiscussions,
  addReply,
};