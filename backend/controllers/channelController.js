import Channel from "../models/Channel.js";
import User from "../models/User.js";

// CREATE CHANNEL (Protected)
export const createChannel = async (req, res) => {
  try {
    const { channelName, description, channelBanner } = req.body;

    if (!channelName) {
      return res.status(400).json({ message: "Channel name is required" });
    }

    const channel = await Channel.create({
      channelName,
      description,
      channelBanner,
      owner: req.user.id, // from JWT middleware
    });

    // Add channel to user's channel list
    await User.findByIdAndUpdate(req.user.id, {
      $push: { channels: channel._id },
    });

    res.status(201).json({
      message: "Channel created successfully",
      channel,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET CHANNEL BY ID (Public)
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username email")
      .populate("videos");

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
