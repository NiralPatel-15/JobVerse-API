const onlineUsers = new Map();

const addOnlineUser = (userId, socketId) => {
  onlineUsers.set(userId, socketId);
};

const removeOnlineUser = (socketId) => {
  for (const [userId, sId] of onlineUsers.entries()) {
    if (sId === socketId) {
      onlineUsers.delete(userId);
      break;
    }
  }
};

const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};

const getSocketId = (userId) => {
  return onlineUsers.get(userId);
};

module.exports = {
  addOnlineUser,
  removeOnlineUser,
  getOnlineUsers,
  getSocketId,
};
