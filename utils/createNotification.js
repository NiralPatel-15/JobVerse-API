const NotificationModel = require("../models/notification");
const notificationRoutes = require("./notificationRoutes");

const createNotification = async ({
  sender,
  receiver,
  type,
  title,
  message,
  action,
  jobId,
  applicationId,
  metadata = {},
  redirectUrl,
}) => {
  const redirectGenerator = notificationRoutes[type];

  const finalRedirectUrl =
    redirectUrl ||
    (redirectGenerator
      ? redirectGenerator({
          jobId,
          applicationId,
          metadata,
        })
      : "/notifications");

  const notification = await NotificationModel.create({
    sender,
    receiver,
    type,
    title,
    message,
    action,
    jobId,
    applicationId,
    metadata,
    redirectUrl: finalRedirectUrl,
  });

  return notification;
};

module.exports = createNotification;
