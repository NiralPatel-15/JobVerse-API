const socketManager = require("../socket");

const emitTimelineUpdate = (applicationId, timelineItem) => {
  socketManager
    .getIO()
    .to(`application_${applicationId}`)
    .emit("timelineUpdated", {
      applicationId,
      timelineItem,
    });
};

module.exports = {
  emitTimelineUpdate,
};
