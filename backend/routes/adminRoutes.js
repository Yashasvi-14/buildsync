import express from 'express';
import { getAllUsers } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, authorize('admin'), getAllUsers);

export default router;