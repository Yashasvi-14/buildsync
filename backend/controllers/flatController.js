import Flat from '../models/flatModel.js';
import Building from '../models/buildingModel.js';

/**
 * @desc    Add a flat to a building
 * @route   POST /api/buildings/:buildingId/flats
 * @access  Private (Admin/Manager only)
 */
export const addFlat = async (req, res, next) => {
    try {
        const {flatNumber} = req.body;
        const { buildingId } = req.params;

        if(!flatNumber) {
            return res.status(400).json({message: 'Please provide a flat number'});
        }

        const building = await Building.findById(buildingId);
        if(!building) {
            return res.status(404).json({message: 'Building not found'});
        }

        const flat = await Flat.create({
            flatNumber,
            building: buildingId,
        });

        res.status(201).json(flat);
    } catch(error) {
        next(error);
    }
};

/**
 * @desc    Get all flats for a specific building
 * @route   GET /api/buildings/:buildingId/flats
 * @access  Private (Admin/Manager of the building)
 */
export const getFlatsForBuilding = async (req, res, next) => {
    try {
        const { buildingId } = req.params;
        const flats = await Flat.find({building: buildingId}).populate(
            'resident',
            'name email'
        );
        res.status(200).json(flats);

    } catch(error) {
        next(error);
    }
};