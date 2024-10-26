import express from "express";
import { getCategories,createCategories} from "../controllers/categories.controller.js";
import { verifyToken } from "../middleware/jwt.js";
const router = express.Router();

router.get("/",getCategories);
router.post("/",verifyToken,createCategories)

export default router;