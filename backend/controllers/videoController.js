import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// CREATE VIDEO (Protected)
export const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnailUrl, category, channelId } =
      req.body;

    if (!title || !videoUrl || !thumbnailUrl || !category || !channelId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const video = await Video.create({
      title,
      description,
      videoUrl,
      thumbnailUrl,
      category,
      channel: channelId,
      uploader: req.user.id,
    });

    // Add video to channel
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: video._id },
    });

    res.status(201).json({
      message: "Video uploaded successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL VIDEOS (Home Page)
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("channel", "channelName")
      .sort({ createdAt: -1 });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET VIDEO BY ID (Player Page)
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName")
      .populate("uploader", "username");

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE VIDEO (Owner Only)
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (video.uploader.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await video.deleteOne();

    // Remove video from channel
    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    res.status(200).json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// INCREMENT VIDEO VIEWS
export const incrementViews = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({
      message: "View count updated",
      views: video.views,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LIKE VIDEO
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({
      message: "Video liked",
      likes: video.likes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DISLIKE VIDEO
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    res.status(200).json({
      message: "Video disliked",
      dislikes: video.dislikes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
