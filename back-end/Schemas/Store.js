// Components
import mongoose from "mongoose";

// Variables
const Schema = mongoose.Schema;
const storeSchema = new Schema({
  name: String,
  description: String,
  menu: { type: Schema.Types.ObjectId, ref: "Menu" }, // Keep it as a single ObjectId
});

const Store = mongoose.model("Store", storeSchema);

export default Store;
