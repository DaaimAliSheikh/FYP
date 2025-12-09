const express = require("express");
const { Photography } = require("../models");
const {
  authMiddleware,
  photographyVendorMiddleware,
} = require("../middleware/auth");
const { upload } = require("../utils/upload");
const config = require("../config/env");

const router = express.Router();

// Get all photography services
router.get("/", async (req, res) => {
  try {
    const photography = await Photography.find();
    res.json(photography);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get photography service by ID
router.get("/:photography_id", async (req, res) => {
  try {
    const photography = await Photography.findById(req.params.photography_id);
    if (!photography)
      return res.status(404).json({ detail: "Photography service not found" });
    res.json(photography);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create photography service
router.post(
  "/",
  authMiddleware,
  photographyVendorMiddleware,
  upload.single("photographer_image"),
  async (req, res) => {
    try {
      const photographyData = { ...req.body };
      if (req.file) {
        photographyData.photographer_image = `${config.SERVER_BASE_URL}images/${req.file.filename}`;
      }
      const photography = await Photography.create(photographyData);
      res.status(201).json(photography);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Delete photography service
router.delete(
  "/:photography_id",
  authMiddleware,
  photographyVendorMiddleware,
  async (req, res) => {
    try {
      const deleted = await Photography.findByIdAndDelete(
        req.params.photography_id
      );
      if (!deleted)
        return res
          .status(404)
          .json({ detail: "Photography service not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

module.exports = router;
