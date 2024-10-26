import express from "express";

import { verifyToken } from "../middleware/jwt.js";
import { addCartItem, getCartItems, setCartItems } from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/set",verifyToken,setCartItems);
router.post("/",verifyToken,addCartItem)
router.get("/:id",getCartItems)
// router.delete("/",verifyToken,deleteCartItem)

export default router;
