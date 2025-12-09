const express = require("express");
const { Catering, Dish, CateringMenuItem } = require("../models");
const {
  authMiddleware,
  adminMiddleware,
  cateringVendorMiddleware,
} = require("../middleware/auth");
const { upload } = require("../utils/upload");
const config = require("../config/env");

const router = express.Router();

// Get all caterings with menu items
router.get("/", async (req, res) => {
  try {
    const caterings = await Catering.find();
    const cateringsWithMenu = await Promise.all(
      caterings.map(async (catering) => {
        const menuItems = await CateringMenuItem.find({
          catering_id: catering._id,
        }).populate("dish_id");
        return {
          ...catering.toObject(),
          catering_menu_items: menuItems.map((mi) => ({
            ...mi.toObject(),
            dish: mi.dish_id,
          })),
        };
      })
    );
    res.json(cateringsWithMenu);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get all dishes
router.get("/dishes", async (req, res) => {
  try {
    const dishes = await Dish.find();
    res.json(dishes);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Get dish by ID
router.get("/dishes/:dish_id", async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.dish_id);
    if (!dish) return res.status(404).json({ detail: "Dish not found" });
    res.json(dish);
  } catch (error) {
    res.status(500).json({ detail: error.message });
  }
});

// Create catering
router.post(
  "/",
  authMiddleware,
  cateringVendorMiddleware,
  upload.single("catering_image"),
  async (req, res) => {
    try {
      const cateringData = { ...req.body };
      if (req.file) {
        cateringData.catering_image = `${config.SERVER_BASE_URL}images/${req.file.filename}`;
      }
      const catering = await Catering.create(cateringData);
      res.status(201).json(catering);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Delete catering
router.delete(
  "/:catering_id",
  authMiddleware,
  cateringVendorMiddleware,
  async (req, res) => {
    try {
      const deleted = await Catering.findByIdAndDelete(req.params.catering_id);
      if (!deleted)
        return res.status(404).json({ detail: "Catering not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Create dish
router.post(
  "/dishes",
  authMiddleware,
  adminMiddleware,
  upload.single("dish_image"),
  async (req, res) => {
    try {
      const dishData = { ...req.body };
      if (req.file) {
        dishData.dish_image = `${config.SERVER_BASE_URL}images/${req.file.filename}`;
      }
      const dish = await Dish.create(dishData);
      res.status(201).json(dish);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Delete dish
router.delete(
  "/dishes/:dish_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deleted = await Dish.findByIdAndDelete(req.params.dish_id);
      if (!deleted) return res.status(404).json({ detail: "Dish not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Add dish to catering menu
router.post(
  "/menu-items",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const menuItem = await CateringMenuItem.create(req.body);
      res.status(201).json(menuItem);
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

// Remove dish from catering menu
router.delete(
  "/menu-items/:catering_id/:dish_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const deleted = await CateringMenuItem.findOneAndDelete({
        catering_id: req.params.catering_id,
        dish_id: req.params.dish_id,
      });
      if (!deleted)
        return res.status(404).json({ detail: "Menu item not found" });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ detail: error.message });
    }
  }
);

module.exports = router;
