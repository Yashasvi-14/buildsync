import express from 'express';
import { raiseComplaint, getComplaints } from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true});

router.post('/', protect, authorize('resident'), raiseComplaint);

export default router;