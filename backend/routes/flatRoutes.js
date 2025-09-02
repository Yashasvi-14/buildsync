import express from 'express';
import { addFlat, getFlatsForBuilding } from '../controllers/flatController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({mergeParams: true});

router.post('/', protect, authorize('admin','manager'), addFlat);

router.get('/', protect, authorize('admin', 'manager'), getFlatsForBuilding);

export default router;