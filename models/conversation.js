const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
  {
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function (val) {
          return val.length === 2;
        },
        message: "Conversation must have exactly 2 members",
      },
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

ConversationSchema.index({ members: 1 });

module.exports = mongoose.model("Conversation", ConversationSchema);
