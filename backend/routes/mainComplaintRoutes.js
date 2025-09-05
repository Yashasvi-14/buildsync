import express from 'express';
import { getComplaints , updateComplaintStatus, assignComplaintToStaff} from '../controllers/complaintController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/', protect, getComplaints);

router.put('/:complaintId', protect, authorize('admin', 'manager'), updateComplaintStatus);

router.put('/:complaintId/assign', protect,authorize('admin','manager'), assignComplaintToStaff);

export default router;