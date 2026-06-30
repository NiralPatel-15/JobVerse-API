const userModel = require("../models/user");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const NotificationModel = require("../models/notification");
const { sendEmail } = require("../services/emailService");
const welcomeEmailTemplate = require("../templates/welcomeEmail");

const cookieOption = {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  path: "/", // ✅ ADD THIS
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google login (temporary)
exports.loginThroughGmail = async (req, res) => {
  try {
    const userExist = await User.findOne({ email: "googleuser@gmail.com" });

    let user = userExist;

    if (!userExist) {
      user = await User.create({
        email: "googleuser@gmail.com",
        f_name: "Google User",
      });
    }

    let jwttoken = jwt.sign(
      {
        id: user._id,
        role: user.role || "user",
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("token", jwttoken, cookieOption);

    // ✅ FIX: SEND TOKEN ALSO
    return res.status(200).json({
      user,
      token: jwttoken,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Register
exports.register = async (req, res) => {
  try {
    let { email, password, f_name, role } = req.body;

    // ✅ TRIM INPUT
    email = email?.trim();
    password = password?.trim();
    f_name = f_name?.trim();

    // ✅ REGEX
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    const nameRegex = /^[A-Za-z ]{3,30}$/;

    // ✅ CHECK EMPTY
    if (!email || !password || !f_name) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ EMAIL VALIDATION
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // ✅ NAME VALIDATION
    if (!nameRegex.test(f_name)) {
      return res.status(400).json({
        error: "Name must contain only letters (3-30 chars)",
      });
    }

    // ✅ PASSWORD VALIDATION
    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    // ✅ CHECK USER EXISTS
    let isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        error: "Already have an account with this email",
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      f_name,
      role: role || "user", 
    });

    await newUser.save();

    try {
      await sendEmail({
        to: email,
        subject: "Welcome to JobVerse 🎉",
        html: welcomeEmailTemplate(f_name),
      });
    } catch (emailError) {
      console.log("Welcome email failed:", emailError.message);
    }

    return res.status(201).json({
      message: "User Registered Successfully",
      success: "yes",
      data: newUser,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ error: "User not found" });
    }

    const isMatch = await bcryptjs.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Normal login
    let token = jwt.sign(
      {
        id: userExist._id, // ✅ FIXED
        role: userExist.role, // ✅ optional
      },
      process.env.JWT_PRIVATE_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, cookieOption);

    return res.status(200).json({
  message: "Logged in successfully",
  success: true,
  user: userExist,
  token,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Update
exports.updateUser = async (req, res) => {
  try {
    const { user } = req.body;

    const existingUser = await User.findById(req.user._id);

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        f_name: user.f_name,
        headline: user.headline,
        curr_company: user.curr_company,
        curr_location: user.curr_location,
        about: user.about,
        skills: user.skills,
        experience: user.experience,
        profilePic: user.profilePic,
        cover_pic: user.cover_pic,
        resume: user.resume,

        // Recruiter fields
        companyWebsite: user.companyWebsite,
        companySize: user.companySize,
        industry: user.industry,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      error: "Server error",
      message: err.message,
    });
  }
};

// Get Profile
exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ check valid Mongo ID (VERY IMPORTANT)
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(id)
      .populate("friends", "-password")
      .populate("sent_requests", "-password")
      .populate("received_requests", "-password");

    if (!user) {
      return res.status(404).json({ error: "No Such User Exist" });
    }

    return res.status(200).json({
      message: "User fetched successfully",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};


// Logout
exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/", // ✅ IMPORTANT (must match login)
    });

    return res.status(200).json({
      message: "Logout successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

// Find User
exports.findUser = async (req, res) => {
  try {
    let { query } = req.query;

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { f_name: { $regex: new RegExp(`^${query}`, "i") } },
            { email: { $regex: new RegExp(`^${query}`, "i") } },
          ],
        },
      ],
    });

    return res.status(200).json({
      message: "Fetched Member",
      users: users,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Send Friend Request
exports.sendFriendReq = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiver } = req.body;

    const sender = await User.findById(senderId);
    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(400).json({ error: "No such user exist." });
    }

    // ❌ prevent duplicate
    if (sender.sent_requests.includes(receiver)) {
      return res.status(400).json({
        error: "Already sent request",
      });
    }

    // ✅ ADD REQUEST
    sender.sent_requests.push(receiver);
    receiverUser.received_requests.push(senderId);

    // 🔔 notification (same as your code)
    let content = `${req.user.f_name} has sent you friend request`;

    const notification = new NotificationModel({
      sender: senderId,
      receiver,
      content,
      type: "request",
    });

    await notification.save();

    await sender.save();
    await receiverUser.save();

    res.status(200).json({ message: "Friend Request Sent" });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Accept Friend Request
exports.acceptFriendReq = async (req, res) => {
  try {
    let { friendId } = req.body;

    const user = await User.findById(req.user._id);
    const friend = await User.findById(friendId);

    // ✅ check request exists
    const exists = user.received_requests.includes(friendId);

    if (!exists) {
      return res.status(400).json({ error: "No request from this user" });
    }

    // ✅ REMOVE FROM REQUEST LIST
    user.received_requests.pull(friendId);
    friend.sent_requests.pull(user._id);

    // ✅ ADD TO FRIENDS
    user.friends.push(friendId);
    friend.friends.push(user._id);

    const notification = new NotificationModel({
      sender: req.user._id,
      receiver: friendId,
      content: `${req.user.f_name} accepted your request`,
      type: "connection",
    });

    await notification.save();

    await user.save();
    await friend.save();

    return res.status(200).json({
      message: "You both are now friends",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Remove Friend
exports.removeFromFriend = async (req, res) => {
  try {
    let selfId = req.user._id;
    let { friendId } = req.params;

    const friendData = await User.findById(friendId);

    const index = req.user.friends.findIndex((id) => id.equals(friendId));
    const friendIndex = friendData.friends.findIndex((id) => id.equals(selfId));

    if (index !== -1) req.user.friends.splice(index, 1);
    if (friendIndex !== -1) friendData.friends.splice(friendIndex, 1);

    await req.user.save();
    await friendData.save();

    return res.status(200).json({
      message: "You both are disconnected now.",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Get Friends List
exports.getFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "-password"
    );

    return res.status(200).json({
      message: "Friends fetched successfully",
      friends: user.friends,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// Get Pending Friends List
exports.getPendingFriendsList = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "received_requests",
      "-password",
    );

    return res.status(200).json({
      message: "Pending friends fetched",
      pendingFriends: user.received_requests,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};