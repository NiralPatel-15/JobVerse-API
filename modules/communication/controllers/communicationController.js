const messagingService = require("../services/messagingService");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.createConversation = async (req, res) => {
  try {
    const conversation = await messagingService.createConversation(req.body);

    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create conversation",
    });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const message = await messagingService.sendMessage(req.body);

    res.status(201).json(message);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to send message",
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await messagingService.getConversationMessages(
      req.params.conversationId,
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch messages",
    });
  }
};

exports.getOrCreateConversation = async (req, res) => {
  try {
    const { applicationId, participants } = req.body;

    let conversation = await Conversation.findOne({
      applicationId,
    });

    // CREATE IF NOT EXISTS

    if (!conversation) {
      conversation = await Conversation.create({
        type: "candidate",

        applicationId,

        participants,
      });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to get conversation",
    });
  }
};

exports.getRecruiterConversations = async (req, res) => {
  try {
    const userId = req.user?.id;

    const conversations = await Conversation.find()
      .populate("participants", "name email")
      .sort({
        lastMessageAt: -1,
      });

    const formattedConversations = conversations.map((conversation) => ({
      ...conversation.toObject(),
      unreadCount: conversation.unreadCounts?.get(userId?.toString()) || 0,
    }));

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch conversations",
    });
  }
};

exports.getUnreadCounts = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      participants: userId,
    });

    const unreadCounts = conversations.map((conversation) => ({
      conversationId: conversation._id,
      unreadCount: conversation.unreadCounts?.get(userId.toString()) || 0,
    }));

    return res.status(200).json({
      success: true,
      unreadCounts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread counts",
    });
  }
};

exports.searchConversations = async (req, res) => {
  try {
    const { query } = req.query;

    // Search conversations
    const conversations = await Conversation.find().populate(
      "participants",
      "name email avatar",
    );

    const filteredConversations = conversations.filter((conversation) =>
      conversation.participants.some((participant) =>
        participant.name?.toLowerCase().includes(query.toLowerCase()),
      ),
    );

    // Search messages
    const messages = await Message.find({
      content: {
        $regex: query,
        $options: "i",
      },
    })
      .populate("sender", "name email")
      .sort({
        createdAt: -1,
      })
      .limit(20);

    res.status(200).json({
      conversations: filteredConversations,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Search failed",
    });
  }
};

exports.markConversationRead = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const userId = req.user.id;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    conversation.unreadCounts.set(userId, 0);

    await conversation.save();

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

exports.markMessagesSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const userId = req.user.id;

    const updatedMessages = await messagingService.markMessagesSeen({
      conversationId,
      userId,
    });

    return res.status(200).json({
      success: true,
      updatedMessages,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update seen status",
    });
  }
};