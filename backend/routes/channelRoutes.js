import express from "express";
import {
  createChannel,
  getChannelById,
} from "../controllers/channelController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected route
router.post("/", authMiddleware, createChannel);

// Public route
router.get("/:id", getChannelById);

export default router;
