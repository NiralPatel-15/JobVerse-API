const express = require("express");
const router = express.Router();
const Authentication = require("../authentication/auth");
const PostController = require("../controller/post");

// Create Post
router.post("/", Authentication.auth, PostController.addPost);

// Like / Dislike
router.post(
  "/likeDislike",
  Authentication.auth,
  PostController.likeDislikePost,
);

// Get Posts
router.get("/getAllPost", PostController.getAllPost);
router.get("/getPostById/:postId", PostController.getPostByPostId);
router.get("/getTop5Post/:userId", PostController.getTop5PostForUser);
router.get("/getAllPostForUser", PostController.getAllPostForUser);

// ✅ ADD THIS (FIX)
router.put("/:id", Authentication.auth, PostController.updatePost);

// Delete
router.delete("/:id", Authentication.auth, PostController.deletePost);

module.exports = router;