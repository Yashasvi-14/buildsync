import express from 'express';
import { getAllUsers, deleteUser, updateUserRole} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getPendingUsers, approveUser } from '../controllers/userController.js';

const router = express.Router();

router
    .route('/users')
    .get(protect, authorize('admin'), getAllUsers);

router
    .route('/users/:userId')
    .delete(protect, authorize('admin'), deleteUser)
    .put(protect,authorize('admin'), updateUserRole);

router.get("/pending-users", protect, authorize("admin", "manager"), getPendingUsers);

router.patch("/approve-user/:id", protect, authorize("admin", "manager"), approveUser);

export default router;