// Components
import express from "express";
import Store from "../Schemas/Store.js";
import Category from "../Schemas/Category.js";
import Menu from "../Schemas/Menu.js";

// Variables
const router = express.Router();
router.use(express.json());

// Create Category
router.post("/:storeId/:menuId/create-category", async (req, res) => {
  try {
    // Variables
    const { name } = req.body;
    const menuId = req.params.menuId;
    const storeId = req.params.storeId;

    // Check if the specified menu & store exists
    const menu = await Menu.findById(menuId);
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Check if a category with the same name already exists in the specified menu
    const categoryExists = menu.categories.some(
      (category) => category.name === name
    );

    if (categoryExists) {
      return res.status(400).json({
        error:
          "Category name already exists in this menu. Please insert a different name.",
      });
    }

    // Create a new category
    const newCategory = new Category({ name });

    // Save the new category to get its _id
    const createdCategory = await newCategory.save();

    // Add the new category's _id to the menu's categories array
    menu.categories.push(createdCategory._id);

    // Save the menu
    await menu.save();

    res.status(201).json(createdCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Unable to create the category." });
  }
});

// Read Category
router.get("/:storeId/:menuId/category/:categoryId", async (req, res) => {
  try {
    // Variables
    const storeId = req.params.storeId;
    const menuId = req.params.menuId;
    const categoryId = req.params.categoryId;

    // Find
    const store = await Store.findById(storeId);
    const menu = await Menu.findById(menuId);
    const category = await Category.findById(categoryId);

    // Conditionals
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Read Category
    return res.status(202).json(category);
  } catch (error) {
    console.error("Error reading category:", error);
    res.status(500).json({ error: "Unable to read category." });
  }
});

// Read Categories
router.get("/:storeId/:menuId/read-categories", async (req, res) => {
  try {
    // Variables
    const storeId = req.params.storeId;
    const menuId = req.params.menuId;

    // Find
    const store = await Store.findById(storeId);
    const menu = await Menu.findById(menuId).populate("categories");

    // Conditionals
    if (!store) {
      return res.status(404).json({ error: "Store not found" });
    }

    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Read Categories
    return res.status(202).json({ categories: menu.categories });
  } catch (error) {
    console.error("Error reading category:", error);
    res
      .status(500)
      .json({ error: "Unable to read category.", details: error.message });
  }
});

// Update Category
router.put("/:categoryId", async (req, res) => {
  try {
    // Variables
    const categoryId = req.params.categoryId;
    const { name } = req.body;

    // Find the category by its ID
    const category = await Category.findById(categoryId);

    // If the Category doens't exists, return a 404 response
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update the category's name if the 'name' field is provided in the request
    if (name) {
      category.name = name;
    }

    // Save the updated category
    const updatedCategory = await category.save();

    // Send a success response with the updated category
    return res.status(200).json(updatedCategory);
  } catch (error) {
    console.error("Error updating category", error);
    res.status(500).json({ error: "Unable to update category" });
  }
});

// Delete Category
router.delete("/:categoryId", async (req, res) => {
  try {
    // Variables
    const menuId = req.params.menuId;
    const categoryId = req.params.categoryId;

    // Find menu by its ID
    const menu = await Menu.findById(menuId);

    // If menu doesn't exists
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    // Find category by its id
    const category = await Category.findById(categoryId);

    // If category doens't exists
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Delete the category
    await Category.findByIdAndDelete(categoryId);

    // Remove the categoyr ID from the menu's categories array
    menu.categories = menu.categories.filter(
      (id) => id.toString() !== categoryId
    );

    // Save the updated menu
    await menu.save();

    // Send a success response
    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category", error);
    res.status(500).json({ error: "Unable to delete category" });
  }
});

export default router;
