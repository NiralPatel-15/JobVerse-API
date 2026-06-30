const registerShortlistSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinJobRoom", (jobId) => {
      socket.join(jobId);
    });

    socket.on("disconnect", () => {
      console.log("Recruiter disconnected");
    });
  });
};

module.exports = registerShortlistSocket;
