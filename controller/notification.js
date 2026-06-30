const NotificationModel = require("../models/notification");
const UserModel = require("../models/user"); 

// ✅ GET NOTIFICATIONS
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await NotificationModel.find({
      receiver: userId,
    })
      .populate("sender", "f_name profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      notifications,
    });
  } catch (error) {
    console.log("NOTIFICATION ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// ✅ MARK AS READ
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    await NotificationModel.findByIdAndUpdate(notificationId, {
      isRead: true,
    });

    res.status(200).json({
      message: "Marked as read",
    });
  } catch (error) {
    console.log("MARK READ ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET UNREAD COUNT
exports.activeNotification = async (req, res) => {
  try {
    let ownId = req.user._id;

    const count = await NotificationModel.countDocuments({
      receiver: ownId, // ✅ fixed
      isRead: false,
    });

    return res.status(200).json({
      message: "Notifications Count Fetched Successfully",
      count,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// ✅ MARK ALL AS READ
exports.markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await NotificationModel.updateMany(
      {
        receiver: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      },
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.log("MARK ALL READ ERROR:", error);

    res.status(500).json({
      error: error.message,
    });
  }
};