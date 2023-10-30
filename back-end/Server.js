// Components
import express from "express";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import "./Database.js";
//

const app = express();
dotenv.config();

// Routes
import menuRoutes from "./Routes/Menu.js";
import categoryRoutes from "./Routes/Category.js";

app.use("/menu", menuRoutes);
app.use("/menu", categoryRoutes);

// PORT
const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
