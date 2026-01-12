import express from "express";
import {
  addComment,
  getCommentsByVideo,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected
router.post("/", authMiddleware, addComment);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);

// Public
router.get("/:videoId", getCommentsByVideo);

export default router;
