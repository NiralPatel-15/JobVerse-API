const ChannelMessage = require("../models/ChannelMessage");

const extractMentions = require("../utils/extractMentions");

const Notification = require("../../communication/models/Notification");

const User = require("../../../models/user");
const registerChannelSocket = (io, socket) => {
  // JOIN CHANNEL ROOM
  socket.on("joinChannelRoom", (channelId) => {
    socket.join(`channel_${channelId}`);
  });

  // LEAVE CHANNEL ROOM
  socket.on("leaveChannelRoom", (channelId) => {
    socket.leave(`channel_${channelId}`);
  });

  // SEND CHANNEL MESSAGE
  socket.on("sendChannelMessage", async (data) => {
    try {
      const { channelId, senderId, content } = data;

      const mentionedUsers = await extractMentions(content);

      const message = await ChannelMessage.create({
        channel: channelId,
        sender: senderId,
        content,
        mentions: mentionedUsers,
      });

      const sender = await User.findById(senderId).select("f_name");

      for (const userId of mentionedUsers) {
        const notification = await Notification.create({
          userId,

          title: "Channel Mention",

          message: `${sender?.f_name} mentioned you in a channel`,

          type: "channel",

          metadata: {
            channelId,
            messageId: message._id,
          },
        });

        io.to(userId.toString()).emit("notification:new", notification);
      }

      const populatedMessage = await ChannelMessage.findById(
        message._id,
      ).populate("sender", "f_name email profilePic curr_company");

      io.to(`channel_${channelId}`).emit("channelMessage", populatedMessage);
    } catch (error) {
      console.error("Channel Message Error:", error);
    }
  });
};

module.exports = registerChannelSocket;
