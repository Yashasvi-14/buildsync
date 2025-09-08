import express from 'express';
import { registerUser , loginUser , getUserProfile , uploadProfilePictures} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getUserProfile);

router.put('/profile/picture', protect, upload.single('profilePicture'), uploadProfilePictures);


export default router;