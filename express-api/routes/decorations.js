const express = require("express");
const { Decoration } = require("../models");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");
const { upload } = require("../utils/upload");
const config = require("../config/env");

const router = express.Router();

// Get all decorations
router.get("/", async (req, res) => {
  try {
    const decorations = await Decoration.find();
    res.json(decorations);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get decoration by ID
router.get("/:decoration_id", async (req, res) => {
  try {
    const decoration = await Decoration.findById(req.params.decoration_id);
    if (!decoration)
      return res.status(404).json({ detail: "Decoration not found" });
    res.json(decoration);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create decoration
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("decoration_image"),
  async (req, res) => {
    try {
      const decorationData = { ...req.body };
      if (req.file) {
        decorationData.decoration_image = `${config.SERVER_BASE_URL}images/${req.file.filename}`;
      }
      const decoration = await Decoration.create(decorationData);
      res.status(201).json(decoration);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Delete decoration
router.delete(
  "/:decoration_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deleted = await Decoration.findByIdAndDelete(
        req.params.decoration_id
      );
      if (!deleted)
        return res.status(404).json({ detail: "Decoration not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

module.exports = router;
