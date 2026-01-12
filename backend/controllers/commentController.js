import Comment from "../models/Comment.js";

// ADD COMMENT (Protected)
export const addComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    if (!text || !videoId) {
      return res.status(400).json({ message: "Text and videoId are required" });
    }

    const comment = await Comment.create({
      text,
      video: videoId,
      user: req.user.id,
    });

    res.status(201).json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET COMMENTS BY VIDEO ID (Public)
export const getCommentsByVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ video: req.params.videoId })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE COMMENT (Owner Only)
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE COMMENT (Owner Only)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await comment.deleteOne();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
