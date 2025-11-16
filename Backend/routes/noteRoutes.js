// backend/routes/noteRoutes.js
import express from "express";
import { pool } from "../model/db.js";

const router = express.Router();

// GET /api/notes
router.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching notes:", err.message);
    res.status(500).json({ message: "Failed to fetch notes" });
  }
});

// POST /api/notes
router.post("/notes", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const result = await pool.query(
      "INSERT INTO notes(text) VALUES($1) RETURNING *",
      [text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating note:", err.message);
    res.status(500).json({ message: "Failed to create note" });
  }
});

// PUT /api/notes/:id
router.put("/notes/:id", async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE notes SET text=$1, updated_at=NOW() WHERE id=$2 RETURNING *",
      [text, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating note:", err.message);
    res.status(500).json({ message: "Failed to update note" });
  }
});

// DELETE /api/notes/:id
router.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM notes WHERE id=$1", [id]);
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error("Error deleting note:", err.message);
    res.status(500).json({ message: "Failed to delete note" });
  }
});

export default router;
