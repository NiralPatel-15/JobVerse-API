const { createNotification } = require("../services/notificationService");

const { emitNotification } = require("../socket/notificationSocket");

const sendNotification = async ({
  io,
  onlineUsers,
  userId,
  title,
  message,
  type,
  metadata = {},
}) => {
  const notification = await createNotification({
    userId,
    title,
    message,
    type,
    metadata,
  });

  await emitNotification(io, onlineUsers, userId, notification);

  return notification;
};

module.exports = sendNotification;
