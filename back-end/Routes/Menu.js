// Components
import express from "express";
import Menu from "../Schemas/Menu.js";
import Category from "../Schemas/Category.js";

// Variables
const router = express.Router();
router.use(express.json());

// Create Menu
router.post("/create-menu", async (req, res) => {
  try {
    // Variables
    const { name, doesDelivery, doesCollection } = req.body;

    // Create new menu
    const newMenu = new Menu({ doesDelivery, doesCollection, name });

    // Save the menu into the database
    const menu = await newMenu.save();

    return res.status(201).json(menu);
  } catch (error) {
    console.error("Error creating menu:", error);
    return res.status(500).json({ error: "Unable to create the menu" });
  }
});

// Read menu
router.get("/:menuId", async (req, res) => {
  try {
    // Variables
    const menuId = req.params.menuId;

    // Find the menu by its ID
    const menu = await Menu.findById(menuId);

    if (!menu) {
      // If doesn't exist, send a 404 response
      return res.status(404).json({ error: "Menu not found." });
    }

    // Send the retrieved menu data in the response
    return res.status(200).json(menu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Unable to fetch the menu." });
  }
});

// Get all the menus
router.get("/rq/get-menus", async (req, res) => {
  try {
    // Variables
    const menus = await Menu.find({});

    return res.json({ menus });
  } catch (error) {
    console.error("Error fetching data: ", error);
    return res.status(500).json({ error: "Failed to retrieve data" });
  }
});

// Update menu
router.put("/:menuId", async (req, res) => {
  try {
    // Variables
    const menuId = req.params.menuId;

    // Extract the updated menu data from the request body
    const updatedMenuData = req.body;

    // Attemp to find and update the menu by its ID
    const menu = await Menu.findByIdAndUpdate(menuId, updatedMenuData, {
      new: true,
    });

    if (menu) {
      // If the menu was found and updated, respond with the updated menu
      return res
        .status(200)
        .json({ message: "Menu updated successfully", menu: menu });
    } else {
      return res.status(404).json({ error: "Menu not found" });
    }
  } catch (error) {
    // Handle any potential errors that might occur during the update
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Menu
router.delete("/:menuId", async (req, res) => {
  try {
    // Variables
    const menuId = req.params.menuId;
    const menu = await Menu.findByIdAndDelete(menuId);

    if (menu) {
      const categories = menu.categories;

      if (categories.length > 0) {
        for (const categoryId of categories) {
          await Category.findByIdAndDelete(categoryId);
        }
      }

      return res.status(200).json({
        message:
          "Menu and its associated categories have been deleted successfully",
        menu: menu,
      });
    }

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Read categories of the menu
router.get("/:menuId/categories", async (req, res) => {
  try {
    // Variables
    const menuId = req.params.menuId;

    // Find the menu by its ID
    const menu = await Menu.findById(menuId);

    // If the menu exists
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // If menu has categories
    if (!menu.categories || menu.categories.length === 0) {
      return res.status(200).json({ message: "Menu has no categories" });
    }

    // Get the ID of each category from the found menu
    const { categories } = menu;

    // Get all the categories by its ID and push them into an array
    const categoriesArray = await Promise.all(
      categories.map(async (categoryId) => {
        const category = await Category.findById(categoryId);
        return category;
      })
    );

    // Send the retrieved menu data in the response
    return res.status(200).json(categoriesArray);
  } catch (error) {
    console.error("Error fetching categories", error);
    res.status(500).json({ error: "Unable to fetch categories" });
  }
});

export default router;
