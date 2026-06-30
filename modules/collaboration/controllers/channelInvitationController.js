const ChannelInvitation = require("../../communication/models/ChannelInvitation");
const Channel = require("../models/Channel");

const Notification = require("../../communication/models/Notification");

exports.sendInvitation = async (req, res) => {
  try {
    const { channelId, recruiterId } = req.body;

    const channel = await Channel.findById(channelId);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    const alreadyMember = channel.members.some(
      (member) => member.toString() === recruiterId,
    );

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: "Recruiter already member",
      });
    }

    const existingInvitation = await ChannelInvitation.findOne({
      channel: channelId,
      invitedUser: recruiterId,
      status: "pending",
    });

    if (existingInvitation) {
      return res.status(400).json({
        success: false,
        message: "Invitation already exists",
      });
    }

    const invitation = await ChannelInvitation.create({
      channel: channelId,
      invitedBy: req.user._id,
      invitedUser: recruiterId,
    });

    await Notification.create({
      userId: recruiterId,

      title: "Channel Invitation",

      message: `${channel.name} invited you to join channel`,

      type: "channel_invitation",

      metadata: {
        invitationId: invitation._id,
        channelId,
      },
    });

    res.status(201).json({
      success: true,
      invitation,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to send invitation",
    });
  }
};

exports.getPendingInvitations = async (req, res) => {
  try {
    const invitations = await ChannelInvitation.find({
      invitedUser: req.user._id,
      status: "pending",
    })
      .populate("channel", "name description")
      .populate("invitedBy", "f_name email profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      invitations,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch invitations",
    });
  }
};

exports.acceptInvitation = async (req, res) => {
  try {
    const invitation = await ChannelInvitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    invitation.status = "accepted";

    await invitation.save();

    await Channel.findByIdAndUpdate(invitation.channel, {
      $addToSet: {
        members: invitation.invitedUser,
      },
    });

    res.status(200).json({
      success: true,
      message: "Invitation accepted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to accept invitation",
    });
  }
};

exports.rejectInvitation = async (req, res) => {
  try {
    const invitation = await ChannelInvitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    invitation.status = "rejected";

    await invitation.save();

    res.status(200).json({
      success: true,
      message: "Invitation rejected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to reject invitation",
    });
  }
};
