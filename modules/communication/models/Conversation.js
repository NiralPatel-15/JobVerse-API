const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["candidate", "recruiter"],
      required: true,
    },

    title: {
      type: String,
      trim: true,
      default: "",
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      default: null,
    },

    lastMessage: {
      type: String,
      default: "",
      trim: true,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Search indexes
conversationSchema.index({
  title: "text",
});

conversationSchema.index({
  participants: 1,
});

conversationSchema.index({
  lastMessageAt: -1,
});

module.exports =
  mongoose.models.EnterpriseConversation ||
  mongoose.model("EnterpriseConversation", conversationSchema);