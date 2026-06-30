const express = require("express");
const router = express.Router();

const { updatePost } = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ IMPORTANT: NO /post HERE
router.put("/:id", authMiddleware, updatePost);

module.exports = router;
