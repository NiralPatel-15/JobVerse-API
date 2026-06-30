const mongoose = require("mongoose");
const ConversationModel = require("../models/conversation");
const MessageModel = require("../models/message");

// ✅ ADD CONVERSATION / SEND MESSAGE
exports.addConversation = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    console.log("REQ USER:", req.user);

    const userId = req.user._id;
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({
        error: "ReceiverId and message are required",
      });
    }

    // 🔍 find or create conversation
    let conversation = await ConversationModel.findOne({
      members: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      conversation = new ConversationModel({
        members: [userId, receiverId],
      });
      await conversation.save();
    }

    // ✅ save message
    const newMessage = new MessageModel({
      conversation: conversation._id,
      sender: userId,
      text: message,
    });

    await newMessage.save();

    // ✅ update last message
    conversation.lastMessage = message;
    await conversation.save();

    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      message: newMessage,
    });
  } catch (error) {
    console.log("ADD CONVERSATION ERROR:", error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// GET CONVERSATIONS
exports.getConversation = async (req, res) => {
  try {
    let loggedinId = req.user._id;

    let conversations = await ConversationModel.find({
      members: { $in: [loggedinId] },
    })
      .populate("members", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Fetched Successfully",
      conversations,
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};