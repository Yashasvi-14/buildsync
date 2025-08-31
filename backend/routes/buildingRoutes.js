import express from 'express';
import { createBuilding } from '../controllers/buildingController.js';
import { protect,authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'manager'), createBuilding);

export default router;