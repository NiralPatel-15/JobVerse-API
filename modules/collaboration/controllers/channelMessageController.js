const ChannelMessage = require("../models/ChannelMessage");

exports.getChannelMessages = async (req, res) => {
  try {
    const messages = await ChannelMessage.find({
      channel: req.params.channelId,
    })
      .populate("sender", "f_name email profilePic curr_company")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};
