import mongoose from "mongoose";
import express, { Router } from "express";
import Store from "../Schemas/Store.js";

// Variables
const router = express.Router();
router.use(express.json());

// Create Store
router.post("/create-store", async (req, res) => {
  // Variables
  const { name, description } = req.body;

  try {
    const store = await Store.findOne({ name });

    if (store) {
      return res.status(400).json({
        error: `A store with the name ${name} exists already, please, insert another name`,
      });
    }

    const newStore = new Store({
      name,
      description,
      menu: null, // Set the menu property to false by default
    });

    await newStore.save();

    return res
      .status(201)
      .json({ message: `Store ${name} has been created successfully.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Read Store
router.get("/singleStore/:storeId/", async (req, res) => {
  // Variables
  const storeId = req.params.storeId;

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res
        .status(500)
        .json({ error: "Store hasn't been found, please try again" });
    }

    const { name, description } = store;

    return res
      .status(201)
      .json({ message: "Store has been found", store: { name, description } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error: ", error });
  }
});

// Read All Stores
router.get("/getAllStores", async (req, res) => {
  try {
    // Fetch all stores from the database
    const stores = await Store.find();

    // Check if any stores were found
    if (stores.length === 0) {
      return res
        .status(200)
        .json({ message: "There are no stores in the database" });
    }

    // Send the stores as a JSON response
    return res.status(200).json({ stores });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update Store
router.put("/:storeId", async (req, res) => {
  // Variables
  const storeId = req.params.storeId;

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(500).json({ message: "Store hasn't been found" });
    }

    const updates = req.body;

    const updateStore = await Store.findByIdAndUpdate(storeId, updates, {
      new: true,
    });

    return res
      .status(201)
      .json({ message: "Store has been updated successfully", updateStore });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Menu has no been updated succesffully", error });
  }
});

// Delete Store
router.delete("/:storeId", async (req, res) => {
  // Variables
  const storeId = req.params.storeId;

  try {
    const store = await Store.findByIdAndDelete(storeId);

    if (store) {
      return res
        .status(201)
        .json({ message: "Store has been deleted successfully", store });
    }

    if (!store) {
      return res.status(500).json({ error: "Store has not been found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error:", error });
  }
});

export default router;
