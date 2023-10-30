// Components
import mongoose from "mongoose";
import dotenv from "dotenv";

// Variables
dotenv.config();
const mongoURI = process.env.MONGODB_URI;
const db = mongoose.connection;

// Connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle Connection
db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB");
});
