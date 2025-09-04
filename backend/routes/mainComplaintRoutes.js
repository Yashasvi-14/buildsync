import express from 'express';
import { getComplaints , updateComplaintStatus} from '../controllers/complaintController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { get } from 'mongoose';

const router = express.Router();

router.get('/', protect, getComplaints);

router.put('/:complaintId', protect, authorize('admin', 'manager'), updateComplaintStatus);

export default router;