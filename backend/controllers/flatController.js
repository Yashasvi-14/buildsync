import Flat from '../models/flatModel.js';
import Building from '../models/buildingModel.js';
import User from '../models/User.js';

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

/**
 * @desc    Assign a resident to a flat
 * @route   PUT /api/buildings/:buildingId/flats/:flatId/assign-resident
 * @access  Private (Admin/Manager only)
 */
export const assignResidentToFlat = async (req, res, next) => {
    try {
        const { flatId } = req.params;
        const { residentId } = req.body;

        if(!residentId) {
            return res.status(400).json({ messag: 'Resident ID is required '});
        }

        const flat = await Flat.findById(flatId);
        if(!flat) {
            return res.status(400).json({message: 'Flat not found'});
        }
        if(flat.resident) {
            return res.status(400).json({message: 'Flat is already occupied'});
        }

        const user = await User.findById(residentId);
        if(!user) {
            return res.status(404).json({message: 'User to be assigned not found'});
        }

        const existingAssignment = await Flat.findOne({resident: residentId});
        if(existingAssignment) {
            return res.status(400).json({message: 'The user is already assigned to another flat'});
        }

        flat.resident = residentId;
        await flat.save();

        const populatedFlat = await Flat.findById(flatId).populate('resident', 'name email');

        res.status(200).json(populatedFlat);
    } catch (error) {
        next(error);
    }
};