import express from 'express';
import { addFlat } from '../controllers/flatController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({mergeParams: true});

router.post('/', protect, authorize('admin','manager'), addFlat);

export default router;