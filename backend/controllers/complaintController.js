import Building from "../models/buildingModel.js";
import Complaint from "../models/complaintModel.js";
import Flat from "../models/flatModel.js";

/**
 * @desc    Raise a new complaint for a flat
 * @route   POST /api/flats/:flatId/complaints
 * @access  Private (Resident only)
 */
export const raiseComplaint = async(req, res, next) => {
    try {
        const { flatId } = req.params;
        const{ title, description, priority} = req.body;
        const residentId = req.user._id;

        if(!title || !description) {
            return res.status(400).json({message: 'Title and description are required'});
        }

        const flat = await Flat.findById(flatId);
        if(!flat){
            return res.status(404).json({ message: 'Flat not found'});
        }

        if(flat.resident.toString() !== residentId.toString()){
            return res.status(403).json({message: 'You can only raise complaints for your own flat'});
        }

        const complaint = await Complaint.create({
            title,
            description,
            priority,
            raisedBy: residentId,
            flat: flatId,
            building: flat.building,
        });

        res.status(201).json(complaint);
    } catch(error) {
        next(error);
    }
};

/**
 * @desc    Get complaints based on user role
 * @route   GET /api/complaints
 * @access  Private
 */
export const getComplaints = async (req, res, next) => {
    try{
        let complaints;
        const userRole = req.user.role;
        const userId=req.user._id;

        if(userRole === 'resident'){
            complaints = await Complaint.find({ raisedBy: userId})
            .populate('flat', 'flatNumber')
            .populate('building', 'name');
        }
        else if (userRole === 'manager') {
            const managedBuildings = await Building.find({manager: userId});

            const buildingIds = managedBuildings.map ( b=> b._id);

            complaints = await Complaint.find({ building: {$in: buildingIds} })
                .populate('raisedBy', 'name')
                .populate('flat', 'flatNumber');
        }
        else if(userRole === 'admin') {
            complaints = await Complaint.find({})
                .populate('raisedBy', 'name')
                .populate('flat', 'flatNumber')
                .populate('building', 'name');
        }

        res.status(200).json(complaints);
    } catch(error) {
        next(error);
    }
};