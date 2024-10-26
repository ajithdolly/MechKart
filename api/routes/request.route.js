import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import { getRequests, setRequests,getRequestsById,validateRequest } from "../controllers/request.controller.js";
const router = express.Router();

router.get("/",verifyToken,getRequests);
router.post("/",verifyToken,setRequests);
router.put("/",verifyToken,validateRequest);
router.get("/user",verifyToken,getRequestsById);


export default router;