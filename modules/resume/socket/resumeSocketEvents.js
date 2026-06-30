const { getIO } = require("../../../socket/socketServer");

const emitResumeProgress = ({
  userId,
  status,
  progress,
  message,
  resumeId,
}) => {
  const io = getIO();

  io.to(`user:${userId}`).emit("resume:progress", {
    status,
    progress,
    message,
    resumeId,
    timestamp: new Date(),
  });
};

module.exports = {
  emitResumeProgress,
};
