import express from 'express';
import { createBuilding, getBuildings } from '../controllers/buildingController.js';
import { protect,authorize } from '../middleware/authMiddleware.js';
import flatRoutes from './flatRoutes.js';

const router =express.Router();

router.use('/:buildingId/flats', flatRoutes);

router.post('/', protect, authorize('admin', 'manager'), createBuilding);

router.get('/', protect, authorize('admin', 'manager'), getBuildings);

export default router; 