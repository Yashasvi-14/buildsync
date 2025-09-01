import express from 'express';
import { createBuilding, getBuildings } from '../controllers/buildingController.js';
import { protect,authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, authorize('admin', 'manager'), createBuilding);

router.get('/', protect, authorize('admin', 'manager'), getBuildings);

export default router; 