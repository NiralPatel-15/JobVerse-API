const PostModel = require("../models/post");

// ADD POST
exports.addPost = async (req, res) => {
  try {
    const { desc, imageLink } = req.body;
    let userId = req.user._id;

    if (!desc && !imageLink) {
      return res.status(400).json({
        error: "Post must have description or image",
      });
    }

    const addPost = new PostModel({
      user: userId,
      desc,
      imageLink, // ✅ now coming from frontend
    });

    await addPost.save();

    res.status(200).json({
      message: "Post Successfully",
      post: addPost,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// LIKE / DISLIKE
exports.likeDislikePost = async (req, res) => {
  try {
    let selfId = req.user._id;
    let { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "PostId required" });
    }

    let post = await PostModel.findById(postId);

    if (!post) {
      return res.status(400).json({ error: "No such post found" });
    }

    const index = post.likes.findIndex((id) => id.equals(selfId));

    if (index !== -1) {
      post.likes.splice(index, 1);
    } else {
      post.likes.push(selfId);
    }

    await post.save();

    res.status(200).json({
      message: index !== -1 ? "Post unliked" : "Post liked",
      likes: post.likes,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// GET ALL POSTS
exports.getAllPost = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate("user", "-password");

    res.status(200).json({
      message: "Fetched Data",
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// GET POST BY ID
exports.getPostByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await PostModel.findById(postId).populate("user", "-password");

    if (!post) {
      return res.status(400).json({ error: "No such post found" });
    }

    return res.status(200).json({
      message: "Fetched Data",
      post,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// TOP 5 POSTS
exports.getTop5PostForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await PostModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password")
      .limit(5);

    return res.status(200).json({
      message: "Fetched Data",
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// ALL POSTS FOR USER
exports.getAllPostForUser = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }

    const posts = await PostModel.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user", "-password");

    return res.status(200).json({
      message: "Fetched Data",
      posts,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// DELETE POST
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ✅ SECURITY CHECK
    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Unauthorized ❌" });
    }

    await post.deleteOne();

    res.status(200).json({
      message: "Post deleted successfully ✅",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error ❌" });
  }
};


// PUT /api/post/:id
// UPDATE POST
exports.updatePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    post.desc = req.body.desc || post.desc;
    post.imageLink = req.body.imageLink || post.imageLink;

    await post.save();

    res.status(200).json({
      message: "Post updated",
      post,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};