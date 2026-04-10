import express from "express";
import { raiseComplaint } from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("resident"),
  (req, res, next) => {
    // TEMP DEMO FIX: skip flat assignment
    req.params.flatId = null;
    return raiseComplaint(req, res, next);
  }
);

export default router;
