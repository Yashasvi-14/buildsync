import express from 'express';
import { addFlat, getFlatsForBuilding, assignResidentToFlat } from '../controllers/flatController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import complaintRoutes from './complaintRoutes.js';

const router = express.Router({mergeParams: true});

router.use('/:flatId/complaints', complaintRoutes);

router
    .route('/')
    .post(protect, authorize('admin','manager'), addFlat)
    .get(protect, authorize('admin', 'manager'), getFlatsForBuilding);

router
    .route('/:flatId/assign-resident')
    .put(protect, authorize('admin', 'manager'), assignResidentToFlat);

export default router;