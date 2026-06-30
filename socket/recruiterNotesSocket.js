const recruiterNotesSocket = (io, socket) => {
  socket.on("joinApplicationNotes", (applicationId) => {
    socket.join(`application:${applicationId}:notes`);
  });

  socket.on("leaveApplicationNotes", (applicationId) => {
    socket.leave(`application:${applicationId}:notes`);
  });
};

module.exports = recruiterNotesSocket;
