const { ROLE_PERMISSIONS } = require("../config/roles");

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};

const allowPermissions = (...permissions) => {
  return (req, res, next) => {
    const rolePermissions = ROLE_PERMISSIONS[req.user.role] || [];

    const userPermissions = req.user.permissions || [];

    const allPermissions = [...rolePermissions, ...userPermissions];

    const hasPermission = permissions.every((perm) =>
      allPermissions.includes(perm),
    );

    if (!hasPermission) {
      return res.status(403).json({
        message: "Insufficient permissions",
      });
    }

    next();
  };
};

module.exports = {
  allowRoles,
  allowPermissions,
};
