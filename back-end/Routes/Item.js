// Components
import express from "express";
import Item from "../Schemas/Item.js";

// Variables
const router = express.Router();

// Create a new item
router.post("/items", async (req, res) => {
  try {
    const { name, description, price, containsAllergens, spicyLevel } =
      req.body;

    // Create a new item
    const newItem = new Item({
      name,
      description,
      price,
      containsAllergens,
      spicyLevel,
    });

    // Save the item to the database
    const item = await newItem.save();

    res.status(201).json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Unable to create the item" });
  }
});

export default router;
