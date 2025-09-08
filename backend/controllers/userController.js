import User from "../models/User.js";
import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
    try{
        const { name, email, password}=req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: "Please enter all fields"});
        }

        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({messagage: "User already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if(newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            });
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req,res,next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.staus(400).json({message: 'Please enter all fields'});
        }

        const user = await User.findOne({ email });

        if(user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '30d'}
            );

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: token,
            });
        } else {
            res.status(401).json({message: 'Invalid credentials'});
        }
    } catch(error) {
        next(error);
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async(req, res) => {
    if(req.user) {
        res.json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
        });
    } else {
        res.status(404).json({message: 'User not found'});
    }
};

/**
 * @desc    Upload or update user profile picture
 * @route   PUT /api/users/profile/picture
 * @access  Private
 */
export const uploadProfilePictures = async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).json({message: 'No file uploaded.'});
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'buildsync_profiles',
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: result.secure_url },
            { new: true, runValidaters: true }
        ).select('-password');

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
