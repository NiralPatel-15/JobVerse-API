const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String,
      required: true,
    },

    entityType: {
      type: String,
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    metadata: {
      type: Object,
      default: {},
    },

    ipAddress: String,

    userAgent: String,
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
