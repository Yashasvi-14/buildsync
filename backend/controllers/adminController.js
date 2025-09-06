import User from "../models/User.js";
import Flat from "../models/flatModel.js";

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

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:userId
 * @access  Private (Admin only)
 */
export const deleteUser = async (req, res, next) => {
    try{
        const user = await User.findById(req.params.userId);

        if(!user) {
            return res.status(404).json({message: 'User not found'});
        }

        if(user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({message: 'Admin cannot delete themselves'});
        }

        if(user.role === 'resident') {
            await Flat.findOneAndUpdate({resident: user._id}, {resident: null});
        }

        await User.findByIdAndDelete(req.params.userId);

        res.status(200).json({message:'User deleted successfully'});
    } catch (error) {
        next(error);
    }
};
