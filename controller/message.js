const MessageModel = require("../models/message");

// SEND MESSAGE
exports.sendMessage = async (req, res) => {
  try {
    let { conversation, message, picture } = req.body;

    // ✅ validation
    if (!message && !picture) {
      return res.status(400).json({
        error: "Message must contain text or picture",
      });
    }

    let addMessage = new MessageModel({
      sender: req.user._id,
      conversation,
      text: message, // ✅ fixed
      picture,
    });

    await addMessage.save();

    let populatedMessage = await addMessage.populate("sender");

    return res.status(201).json(populatedMessage);
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// GET MESSAGES
exports.getMessage = async (req, res) => {
  try {
    let { convId } = req.params;

    const messages = await MessageModel.find({
      conversation: convId,
    })
      .sort({ createdAt: 1 }) // ✅ important
      .populate("sender");

    return res.status(200).json({
      message: "Fetched Messages Successfully",
      messages, // ✅ fixed key
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};