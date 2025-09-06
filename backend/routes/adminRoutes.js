import express from 'express';
import { getAllUsers, deleteUser} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/users')
    .get(protect, authorize('admin'), getAllUsers);

router
    .route('/users/:userId')
    .delete(protect, authorize('admin'), deleteUser);

export default router;