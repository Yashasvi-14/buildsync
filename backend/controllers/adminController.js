import User from "../models/User.js";

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
export const getAllUsers = async(req, res, next) => {
    try{
        const users = await User.find({}).select('-password');
        res.status(200).json(users);
    } catch(error) {
        next(error);
    }
};

