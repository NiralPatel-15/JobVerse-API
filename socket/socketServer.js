let ioInstance = null;

const initializeSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("Recruiter connected:", socket.id);

    socket.on("join:user", (userId) => {
      socket.join(`user:${userId}`);

      console.log(`User joined room user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("Recruiter disconnected:", socket.id);
    });
  });
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO not initialized");
  }

  return ioInstance;
};

module.exports = {
  initializeSocket,
  getIO,
};
