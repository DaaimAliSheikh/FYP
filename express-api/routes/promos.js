const express = require("express");
const { Promo } = require("../models");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

const router = express.Router();

// Get all promos
router.get("/", async (req, res) => {
  try {
    const promos = await Promo.find();
    res.json(promos);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get promo by ID
router.get("/:promo_id", async (req, res) => {
  try {
    const promo = await Promo.findById(req.params.promo_id);
    if (!promo) return res.status(404).json({ detail: "Promo not found" });
    res.json(promo);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create promo
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const promo = await Promo.create(req.body);
    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Delete promo
router.delete(
  "/:promo_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deleted = await Promo.findByIdAndDelete(req.params.promo_id);
      if (!deleted) return res.status(404).json({ detail: "Promo not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

module.exports = router;
