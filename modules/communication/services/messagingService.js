const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

exports.createConversation = async ({ type, participants, applicationId }) => {
  return await Conversation.create({
    type,
    participants,
    applicationId,
  });
};

exports.sendMessage = async ({
  conversationId,
  sender,
  content,
  messageType = "text",
}) => {
  const message = await Message.create({
    conversationId,
    sender,
    content,
    messageType,
    seenBy: [sender],
  });

  await sendNotification({
    io: req.app.get("io"),
    onlineUsers: req.app.get("onlineUsers"),

    userId: receiverId,

    title: "New Message",

    message: `${senderName} sent you a message`,

    type: "message",

    metadata: {
      conversationId,
    },
  });

  const conversation = await Conversation.findById(conversationId);

  conversation.participants.forEach((participantId) => {
    if (participantId.toString() !== sender.toString()) {
      const currentUnread =
        conversation.unreadCounts?.get(participantId.toString()) || 0;

      conversation.unreadCounts.set(
        participantId.toString(),
        currentUnread + 1,
      );
    }
  });

  conversation.lastMessage = content;
  conversation.lastMessageAt = new Date();

  await conversation.save();

  return message.populate("sender", "name email");
};

exports.getConversationMessages = async (conversationId) => {
  return await Message.find({
    conversationId,
  })
    .populate("sender", "name email")
    .sort({ createdAt: 1 });
};

exports.markMessagesSeen = async ({ conversationId, userId }) => {
  await Message.updateMany(
    {
      conversationId,

      sender: {
        $ne: userId,
      },

      seenBy: {
        $ne: userId,
      },
    },
    {
      $push: {
        seenBy: userId,
      },
    },
  );

  return await Message.find({
    conversationId,
  })
    .select("_id seenBy")
    .lean();
};
