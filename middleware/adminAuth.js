const jwt = require("jsonwebtoken");
const User = require("../models/user");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ CHECK TOKEN EXISTS
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    // ✅ REMOVE "Bearer "
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : authHeader;

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // ✅ FIND USER
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // ✅ CHECK ADMIN ROLE
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    // ✅ ATTACH USER
    req.user = user;

    next();
  } catch (error) {
    console.log("Admin Auth Error:", error.message);

    // ✅ TOKEN EXPIRED
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // ✅ INVALID TOKEN
    return res.status(401).json({
      success: false,
      message: "Invalid admin token",
    });
  }
};

module.exports = adminAuth;