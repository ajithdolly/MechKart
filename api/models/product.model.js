import mongoose from "mongoose";
const { Schema } = mongoose;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  cat: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  attribute: {
    featured: {
      type: Boolean,
      default: false,
    },
    latest: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
});

export default mongoose.model("Product", productSchema);
