import express from 'express';
import { registerUser , loginUser , getUserProfile , uploadProfilePictures} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { getBuildingUsers } from "../controllers/userController.js";

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', protect, getUserProfile);

router.put('/profile/picture', protect, upload.single('profilePicture'), uploadProfilePictures);

router.get("/building-users", protect, getBuildingUsers);


export default router;