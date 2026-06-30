const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  actor,
  action,
  entityType,
  entityId,
  metadata = {},
  req,
}) => {
  try {
    await AuditLog.create({
      actor,

      action,

      entityType,

      entityId,

      metadata,

      ipAddress: req.ip,

      userAgent: req.headers["user-agent"],
    });
  } catch (error) {
    console.log("Audit log error:", error.message);
  }
};

module.exports = createAuditLog;
