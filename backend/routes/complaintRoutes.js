import express from 'express';
import { raiseComplaint, getComplaints, updateComplaintStatus, assignComplaintToStaff} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true});

router.post('/', protect, authorize('resident'), raiseComplaint);

router.get('/', protect, getComplaints);

router.put('/:complaintId', protect, authorize('admin', 'manager'), updateComplaintStatus);

router.put(
  '/:complaintId/assign',
  protect,
  authorize('admin', 'manager'),
  assignComplaintToStaff
);


export default router;