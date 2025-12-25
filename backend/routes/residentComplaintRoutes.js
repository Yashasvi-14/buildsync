import express from "express";
import { raiseComplaint } from "../controllers/complaintController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("resident"),
  async (req, res, next) => {
    // For now, assign complaints to the first flat the resident belongs to
    const Flat = (await import("../models/flatModel.js")).default;
    const flat = await Flat.findOne({ resident: req.user._id });

    if (!flat) {
      return res.status(400).json({
        message: "You are not assigned to any flat. Ask manager to assign you.",
      });
    }

    req.params.flatId = flat._id.toString();
    return raiseComplaint(req, res, next);
  }
);

export default router;
