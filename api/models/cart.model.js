import mongoose from "mongoose";
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Model name for the User model
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: "Product", // Model name for the Product model
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Cart", cartSchema);
