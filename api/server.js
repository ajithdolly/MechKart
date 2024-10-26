import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";

import orderRoute from "./routes/order.route.js";



import authRoute from "./routes/auth.route.js";
import categoriesRoute from  "./routes/categories.route.js"
import productRoute from "./routes/product.route.js"
import cartRoute from "./routes/cart.routes.js"
import requestRoute from "./routes/request.route.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

app.use("/api/orders", orderRoute);


app.use("/api/categories",categoriesRoute);
app.use("/api/product",productRoute);
app.use("/api/cart",cartRoute);
app.use("/api/request",requestRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});

app.listen(8800, () => {
  connect();
  console.log("Backend server is running!");
});

//JRNJ2
//cometoeat1
//Git