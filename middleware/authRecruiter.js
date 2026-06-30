const jwt = require("jsonwebtoken");
const User = require("../models/user");

const recruiterAuth = async (req, res, next) => {
  try {
    let token = null;

    // ✅ COOKIE TOKEN
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ✅ HEADER TOKEN
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      // CHECK BEARER FORMAT
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // ✅ TOKEN EXISTS
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found",
      });
    }

    // ✅ INVALID TOKEN CHECK
    if (token === "undefined" || token === "null") {
      return res.status(401).json({
        success: false,
        message: "Invalid token format",
      });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // ✅ FIND USER
    const recruiter = await User.findById(decoded.id).select("-password");

    if (!recruiter) {
      return res.status(401).json({
        success: false,
        message: "Recruiter not found",
      });
    }

    // ✅ ATTACH USER
    req.recruiter = recruiter;

    next();
  } catch (err) {
    console.log("Recruiter Auth Error:", err.message);

    // ✅ TOKEN EXPIRED
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    // ✅ MALFORMED TOKEN
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Malformed recruiter token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized recruiter access",
    });
  }
};

module.exports = recruiterAuth;