import express from 'express';
import { getComplaints } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';
import { get } from 'mongoose';

const router = express.Router();

router.get('/', protect, getComplaints);

export default router;