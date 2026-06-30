const NotificationModel = require("../models/notification");

const sendNotification = async ({
  io,
  sender,
  receiver,
  type,
  action,
  postId = null,
}) => {
  try {
    // ✅ Save in DB
    const notification = await NotificationModel.create({
      sender,
      receiver,
      type,
      action,
      postId,
    });

    // ✅ Populate sender
    const populatedNotification = await NotificationModel.findById(
      notification._id,
    ).populate("sender", "f_name firstname profilePic");

    // ✅ Emit live socket event
    io.to(receiver.toString()).emit("newNotification", populatedNotification);

    return populatedNotification;
  } catch (err) {
    console.log("SEND NOTIFICATION ERROR:", err);
  }
};

module.exports = sendNotification;
