const Notification = require("../models/Notification");

const emitNotification = async (io, onlineUsers, receiverId, notification) => {
  const socketId = onlineUsers.get(receiverId.toString());

  if (!socketId) return;

  io.to(socketId).emit("notification:new", notification);

  const unreadCount = await Notification.countDocuments({
    userId: receiverId,
    read: false,
  });

  io.to(socketId).emit("notification:count", unreadCount);
};

module.exports = {
  emitNotification,
};
