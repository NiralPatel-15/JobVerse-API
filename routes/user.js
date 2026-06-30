const express = require("express");
const router = express.Router();

const userController = require("../controller/user");
const Authentication = require("../authentication/auth");

// ✅ IMPORT USER MODEL (FIX)
const User = require("../models/user");

// ================= AUTH =================
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/google", userController.loginThroughGmail);

// ================= PROTECTED =================
router.put("/update", Authentication.auth, userController.updateUser);
router.get("/user/:id", userController.getProfileById);
router.post("/logout", userController.logout);

// ================= SELF =================
router.get("/self", Authentication.auth, (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
});

// ================= FRIEND =================
router.get("/findUser", Authentication.auth, userController.findUser);

router.post(
  "/sendFriendReq",
  Authentication.auth,
  userController.sendFriendReq,
);
router.post(
  "/acceptFriendReq",
  Authentication.auth,
  userController.acceptFriendReq,
);

router.delete(
  "/removeFromFriendList/:friendId",
  Authentication.auth,
  userController.removeFromFriend,
);

router.get("/friendList", Authentication.auth, userController.getFriendsList);
router.get(
  "/pendingFriendsList",
  Authentication.auth,
  userController.getPendingFriendsList,
);

// ================= SEARCH (FIXED) =================//
const escapeRegex = require("../utils/escapeRegex");

router.get("/search", async (req, res) => {
  try {
    let q = req.query.q || "";

    if (!q.trim()) {
      return res.json([]);
    }

    // ✅ ESCAPE SPECIAL CHARACTERS
    const safeQuery = escapeRegex(q);

    const users = await User.find({
      f_name: { $regex: safeQuery, $options: "i" },
    });

    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;