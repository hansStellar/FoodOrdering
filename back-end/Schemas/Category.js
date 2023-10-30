// Components
import mongoose from "mongoose";

// Variables
const Schema = mongoose.Schema;
const categorySchema = new Schema({
  name: String,
  items: [{ type: Schema.Types.ObjectId, ref: "Item" }],
});
const Category = mongoose.model("Category", categorySchema);

export default Category;
