// Components
import mongoose from "mongoose";

// Variables
const Schema = mongoose.Schema;
const menuSchema = new Schema({
  name: String,
  doesDelivery: Boolean,
  doesCollection: Boolean,
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});
const Menu = mongoose.model("Menu", menuSchema);

export default Menu;
