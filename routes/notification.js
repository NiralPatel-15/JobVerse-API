const express = require("express");
const router = express.Router();
const Authentication = require("../authentication/auth");
const NotificationController = require("../controller/notification");

// ✅ Get all notifications
router.get(
  "/",
  Authentication.auth,
  NotificationController.getNotifications, // ✅ FIXED NAME
);

// ✅ Mark notification as read
router.put(
  "/isRead",
  Authentication.auth,
  NotificationController.markAsRead, // ✅ FIXED NAME
);

// ✅ Get active notifications count
router.get(
  "/activeNotification",
  Authentication.auth,
  NotificationController.activeNotification,
);

// ✅ MARK ALL AS READ
router.put(
  "/mark-all",
  Authentication.auth,
  NotificationController.markAllAsRead,
);

module.exports = router;