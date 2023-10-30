// Components
import mongoose from "mongoose";

// Variables
const Schema = mongoose.Schema;
const itemSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  containsAllergens: Boolean,
  spicyLevel: { type: Number, min: 0, max: 5 },
});
const Item = mongoose.model("Item", itemSchema);

export default Item;
