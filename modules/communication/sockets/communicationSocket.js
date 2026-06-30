const socketIO = require("socket.io");

const {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
} = require("./onlineUsers");

let io;

const initializeSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Recruiter connected:", socket.id);

    // JOIN USER
    socket.on("join-user", (userId) => {
      addOnlineUser(userId, socket.id);

      io.emit("online-users", getOnlineUsers());
    });

    // JOIN CONVERSATION
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // TYPING
    socket.on("typing", (data) => {
      socket.to(data.conversationId).emit("typing", data);
    });

    // STOP TYPING
    socket.on("stop-typing", (data) => {
      socket.to(data.conversationId).emit("stop-typing", data);
    });

    // SEEN RECEIPTS
    socket.on("messages-seen", (data) => {
      socket.to(data.conversationId).emit("messages-seen-updated", {
        conversationId: data.conversationId,
        userId: data.userId,
      });
    });

    // DISCONNECT
    socket.on("disconnect", () => {
      removeOnlineUser(socket.id);
      
      io.emit("online-users", getOnlineUsers());

      // console.log("Recruiter disconnected:", socket.id);
    });
  });
};

const getIO = () => io;

module.exports = {
  initializeSocket,
  getIO,
};
