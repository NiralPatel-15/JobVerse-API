const Channel = require("../modules/collaboration/models/Channel");

socket.on("channelMemberAdded", async (data) => {
  try {
    const { channelId } = data;

    const channel = await Channel.findById(channelId).populate(
      "members",
      "f_name email profilePic curr_company",
    );

    io.to(`channel_${channelId}`).emit(
      "channelMembersUpdated",
      channel.members,
    );
  } catch (error) {
    console.error(error);
  }
});

socket.on("refreshChannelMembers", async (channelId) => {
  try {
    const channel = await Channel.findById(channelId).populate(
      "members",
      "f_name email profilePic curr_company",
    );

    io.to(`channel_${channelId}`).emit(
      "channelMembersUpdated",
      channel.members,
    );
  } catch (error) {
    console.error(error);
  }
});