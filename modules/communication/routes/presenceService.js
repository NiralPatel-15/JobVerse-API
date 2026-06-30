import OnlineUser from "../models/OnlineUser.js";

export const userConnected = async (userId, socketId) => {
  try {
    await OnlineUser.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        socketId,
        status: "online",
        lastSeen: new Date(),
      },
      {
        upsert: true,
        new: true,
      },
    );
  } catch (error) {
    console.log("Presence connect error:", error.message);
  }
};

export const userDisconnected = async (socketId) => {
  try {
    await OnlineUser.findOneAndUpdate(
      { socketId },
      {
        status: "offline",
        lastSeen: new Date(),
      },
    );
  } catch (error) {
    console.log("Presence disconnect error:", error.message);
  }
};

export const getOnlineRecruiters = async () => {
  return await OnlineUser.find({ status: "online" }).populate(
    "user",
    "name email profilePicture",
  );
};
