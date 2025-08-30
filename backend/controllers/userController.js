import User from "../models/User.js";
import bcrypt from 'bcryptjs';
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