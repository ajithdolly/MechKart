import express from "express";

import { setProducts , getProducts} from "../controllers/product.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/",verifyToken, setProducts)
router.get("/", getProducts)

export default router;
