import mongoose from "mongoose";
const { Schema } = mongoose;

const requestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User", // Model name for the User model
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  request: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
});

export default mongoose.model("Request", requestSchema);
