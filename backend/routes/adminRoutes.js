import express from 'express';
import { getAllUsers, deleteUser, updateUserRole} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/users')
    .get(protect, authorize('admin'), getAllUsers);

router
    .route('/users/:userId')
    .delete(protect, authorize('admin'), deleteUser)
    .put(protect,authorize('admin'), updateUserRole);

export default router;