import express from "express";
import { raiseComplaint } from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorize("resident"), raiseComplaint);

export default router;
