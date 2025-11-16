import express from "express";
import { youtube } from "../config/youtube.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const VIDEO_ID = process.env.YOUTUBE_VIDEO_ID;

// GET /api/comments - fetch YouTube comments
router.get("/comments", async (req, res) => {
  try {
    const response = await youtube.commentThreads.list({
      part: ["snippet", "replies"],
      videoId: VIDEO_ID,      // FIXED HERE
      maxResults: 20,
      order: "time",
    });

    res.json(response.data.items || []);
  } catch (err) {
    console.error("Error fetching comments:", err?.response?.data || err.message);
    res.status(500).json({ message: "failed to fetch comments" });
  }
});

// POST /api/comments - Add a new top-level comment
router.post("/comments", async (req, res) => {
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const response = await youtube.commentThreads.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          videoId: VIDEO_ID,
          topLevelComment: {
            snippet: {
              textOriginal: text,
            },
          },
        },
      },
    });

    res.status(201).json(response.data);
  } catch (err) {
    console.error("Error adding comment:", err?.response?.data || err.message);
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// POST /api/comments/:commentId/reply - Reply to a comment
router.post("/comments/:commentId/reply", async (req, res) => {
  const { commentId } = req.params;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const response = await youtube.comments.insert({
      part: ["snippet"],
      requestBody: {
        snippet: {
          parentId: commentId,
          textOriginal: text,
        },
      },
    });

    res.status(201).json(response.data);
  } catch (err) {
    console.error("Error replying to comment:", err?.response?.data || err.message);
    res.status(500).json({ message: "Failed to reply to comment" });
  }
});

// DELETE /api/comments/:commentId - delete comment
router.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;

  try {
    await youtube.comments.delete({
      id: commentId,
    });

    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err?.response?.data || err.message);
    res.status(500).json({ message: "Failed to delete comment" });
  }
});

export default router;
