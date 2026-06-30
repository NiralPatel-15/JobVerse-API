const Channel = require("../models/Channel");
const User = require("../../../models/user");

exports.createChannel = async (req, res) => {
  try {
    const { name, description, type } = req.body;

    const channel = await Channel.create({
      name,
      description,
      type,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    const populatedChannel = await Channel.findById(channel._id)
      .populate("createdBy", "f_name email profilePic")
      .populate("members", "f_name email profilePic");

    res.status(201).json({
      success: true,
      channel: populatedChannel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create channel",
    });
  }
};

exports.getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({
      isArchived: false,
    })
      .populate("createdBy", "f_name email profilePic")
      .populate("members", "f_name email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      channels,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch channels",
    });
  }
};

exports.joinChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    if (!channel.members.includes(req.user._id)) {
      channel.members.push(req.user._id);
      await channel.save();
    }

    const updatedChannel = await Channel.findById(channel._id)
      .populate("createdBy", "f_name email profilePic")
      .populate("members", "f_name email profilePic");

    res.status(200).json({
      success: true,
      channel: updatedChannel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to join channel",
    });
  }
};

exports.leaveChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    channel.members = channel.members.filter(
      (member) => member.toString() !== req.user._id.toString(),
    );

    await channel.save();

    res.status(200).json({
      success: true,
      message: "Left channel successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to leave channel",
    });
  }
};

exports.getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("createdBy", "f_name email profilePic")
      .populate("members", "f_name email profilePic");

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch channel",
    });
  }
};

exports.getChannelMembers = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate(
      "members",
      "f_name email profilePic curr_company",
    );

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    res.status(200).json({
      success: true,
      members: channel.members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch members",
    });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const exists = channel.members.some(
      (member) => member.toString() === memberId,
    );

    if (!exists) {
      channel.members.push(memberId);

      await channel.save();
    }

    const updatedChannel = await Channel.findById(channel._id).populate(
      "members",
      "f_name email profilePic curr_company",
    );

    res.status(200).json({
      success: true,
      channel: updatedChannel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add member",
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { memberId } = req.body;

    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    channel.members = channel.members.filter(
      (member) => member.toString() !== memberId,
    );

    await channel.save();

    const updatedChannel = await Channel.findById(channel._id).populate(
      "members",
      "f_name email profilePic curr_company",
    );

    res.status(200).json({
      success: true,
      channel: updatedChannel,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove member",
    });
  }
};



exports.searchRecruiters = async (req, res) => {
  try {
    const { keyword = "", channelId } = req.query;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const recruiters = await User.find({
      role: "recruiter",
      recruiterStatus: "approved",
      _id: {
        $nin: channel.members,
      },
      $or: [
        {
          f_name: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          email: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          curr_company: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .select("_id f_name email curr_company profilePic curr_location")
      .limit(20);

    res.status(200).json({
      success: true,
      recruiters,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to search recruiters",
    });
  }
};
