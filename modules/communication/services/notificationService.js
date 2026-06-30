const Notification = require("../models/Notification");

exports.createNotification = async ({
  userId,
  title,
  message,
  type,
  metadata = {},
}) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    metadata,
  });

  return notification;
};
