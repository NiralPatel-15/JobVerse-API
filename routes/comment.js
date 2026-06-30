const express = require("express");
const router = express.Router();
const Authentication = require("../authentication/auth");
const CommentController = require("../controller/comment");

// Add Comment
router.post("/", Authentication.auth, CommentController.commentPost);

// Get Comments by Post ID
router.get("/:postId", CommentController.getCommentByPostId);

module.exports = router;
