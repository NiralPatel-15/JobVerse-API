const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    let token = null;

    // COOKIE TOKEN
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // HEADER TOKEN (optional) 
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    // NO TOKEN
    if (!token) {
      return res.status(401).json({
        msg: "No token found",
      });
    }

    // VERIFY
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);

    // FIND USER
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        msg: "User not found",
      });
    }

    req.user = user;

    next();
  } catch (err) {
    console.log("AUTH ERROR:", err.message);

    return res.status(401).json({
      msg: "Token invalid",
    });
  }
};
