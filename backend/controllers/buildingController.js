import Building from '../models/buildingModel.js';

/**
 * @desc    Create a new building
 * @route   POST /api/buildings
 * @access  Private (Admin/Manager only)
 */
export const createBuilding = async (req, res, next) => {
    try {
        const {name, address} = req.body;

        if(!name || !address) {
            return res.status(400).json({message: 'Please provide a name and address'});
        }

        const building = await Building.create({
            name,
            address,
            manager: req.user._id,
        });

        res.status(201).json(building);
    } catch(error) {
        next(error);
    }
};