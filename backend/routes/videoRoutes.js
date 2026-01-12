import express from "express";
import {
  createVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  incrementViews,
  likeVideo,
  dislikeVideo,
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected
router.post("/", authMiddleware, createVideo);
router.delete("/:id", authMiddleware, deleteVideo);

// Public
router.get("/", getAllVideos);
router.get("/:id", getVideoById);

// Views + Likes
router.patch("/:id/views", incrementViews);
router.patch("/:id/like", likeVideo);
router.patch("/:id/dislike", dislikeVideo);

export default router;
