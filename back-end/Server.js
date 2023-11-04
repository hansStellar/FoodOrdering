// Components
import express from "express";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import "./Database.js";
// Test

const app = express();
app.use(cors());
dotenv.config();

// Routes
import menuRoutes from "./Routes/Menu.js";
import categoryRoutes from "./Routes/Category.js";

app.use("/menu", menuRoutes);
app.use("/menu", categoryRoutes);

// CORS Options
const corsOptions = {
  origin: "http://localhost:3001",
};

// PORT
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
