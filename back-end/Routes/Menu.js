// Components
import express from "express";
import Menu from "../Schemas/Menu.js";
import Category from "../Schemas/Category.js";
import Store from "../Schemas/Store.js";

// Variables
const router = express.Router();
router.use(express.json());

// Create Menu
router.post("/:storeId/create-menu", async (req, res) => {
  try {
    // Variables
    const storeId = req.params.storeId;
    const store = await Store.findById(storeId);
    const { name, doesDelivery, doesCollection } = req.body;

    if (!store) {
      return res.status(500).json({ message: "Store hasn't been found" });
    }

    // Check if the store already has a menu
    if (store.menu) {
      return res.status(400).json({
        error: "This store already has a menu. You can't create another one.",
      });
    }

    // Create new menu
    const newMenu = new Menu({ doesDelivery, doesCollection, name });

    // Save the new category to get its _id
    const createdMenu = await newMenu.save();

    // Assign the new menu's _id to the store's menu field
    store.menu = createdMenu._id;

    // Save the Menu inside the Store
    await store.save();

    return res.status(201).json({
      message: `Menu has been created succesfully: `,
      newMenu,
      store,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    return res.status(500).json({ error: "Unable to create the menu" });
  }
});

// Read menu
router.get("/:storeId/:menuId", async (req, res) => {
  try {
    // Variables
    const menuId = req.params.menuId;
    const storeId = req.params.storeId;

    // Find the store by its ID
    const store = await Store.findById(storeId);

    // Find the menu by its ID
    const menu = await Menu.findById(menuId);

    if (!store) {
      return res.status(404).json({ error: "Store not found." });
    }

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

// Update menu
router.put("/:storeId/:menuId", async (req, res) => {
  try {
    // Variables
    const menuId = req.params.menuId;
    const storeId = req.params.storeId;

    const store = await Store.findById(storeId);
    const menu = await Menu.findById(menuId);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    // Extract the updated menu data from the request body
    const updatedMenuData = await req.body;

    // Attemp to find and update the menu by its ID
    const menuUpdated = await Menu.findByIdAndUpdate(menuId, updatedMenuData, {
      new: true,
    });

    if (menuUpdated) {
      // If the menu was found and updated, respond with the updated menu
      return res
        .status(200)
        .json({ message: "Menu updated successfully", menu: menuUpdated });
    } else {
      return res.status(404).json({ error: "Menu not found" });
    }
  } catch (error) {
    console.error("Error updating menu: ", error);
    // Handle any potential errors that might occur during the update
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Menu
router.delete("/:storeId/:menuId", async (req, res) => {
  try {
    // Variables
    const storeId = req.params.storeId;
    const menuId = req.params.menuId;
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const menu = await Menu.findByIdAndDelete(menuId);

    if (menu) {
      store.menu = undefined;
      await store.save();
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
        store: store,
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
router.get("/:storeId/:menuId/categories", async (req, res) => {
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
