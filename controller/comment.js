const CommentModel = require("../models/comment");
const PostModel = require("../models/post");
const NotificationModel = require("../models/notification");

// ADD COMMENT
exports.commentPost = async (req, res) => {
  try {
    const { postId, comment } = req.body;
    const userId = req.user._id;

    // validation
    if (!postId || !comment || !comment.trim()) {
      return res.status(400).json({ error: "PostId and comment required" });
    }

    const postExist = await PostModel.findById(postId);
    if (!postExist) {
      return res.status(400).json({ error: "No such post found" });
    }

    // create comment
    const newComment = await CommentModel.create({
      user: userId,
      post: postId,
      text: comment,
    });

    // push into post
    postExist.comments.push(newComment._id);
    await postExist.save();

    // ✅ populate properly (important)
    const populatedComment = await CommentModel.findById(newComment._id)
      .populate("user", "f_name headline profilePic")
      .lean(); // 🔥 important for frontend consistency

    // notification
    if (!postExist.user.equals(userId)) {
      const notification = new NotificationModel({
        sender: userId,
        receiver: postExist.user,
        content: `${req.user.f_name} has commented on your post`,
        type: "comment",
        postId,
      });

      await notification.save();
    }

    return res.status(200).json({
      message: "Commented Successfully",
      comment: populatedComment,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// GET COMMENTS
exports.getCommentByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    const isPostExist = await PostModel.findById(postId);
    if (!isPostExist) {
      return res.status(400).json({ error: "No such post found" });
    }

    const comments = await CommentModel.find({ post: postId })
      .populate("user", "f_name headline profilePic")
      .sort({ createdAt: -1 })
      .lean(); // 🔥 important

    return res.status(200).json({
      message: "Comments fetched",
      comments,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", message: err.message });
  }
};