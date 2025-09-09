import Building from "../models/buildingModel.js";
import Complaint from "../models/complaintModel.js";
import Flat from "../models/flatModel.js";
import User from "../models/User.js";

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

        const populatedComplaint = await Complaint.findById(complaint._id)
            .populate('raisedBy', 'name')
            .populate('flat', 'flatNumber')
            .populated('building', 'name');

        const io = req.app.get('socketio');
        io.emit('newComplaint', populatedComplaint);

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

/**
 * @desc    Update a complaint's status
 * @route   PUT /api/complaints/:complaintId
 * @access  Private (Admin/Manager only)
 */
export const updateComplaintStatus = async (req, res, next) => {
    try{
        const { complaintId } = req.params;
        const { status } = req.body;
        const user = req.user; 

        const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];

        if(!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Please provide a valid status'});
        }

        const complaint = await Complaint.findById(complaintId);
        if(!complaint) {
            return res.status(404).json({message: 'Complaint not found'});
        }

        if(user.role === 'manager') {
            const managedBuildings = await Building.find({ manager: user._id});
            const managedBuildingsIds = managedBuildings.map(b => b._id.toString());
            if(!managedBuildingsIds.includes(complaint.building.toString())) {
                return res.status(403).json({ message: 'You are not authorized to update this complaint'});
            }
        }

        complaint.status = status;
        await complaint.save();

        res.status(200).json(complaint);
    } catch(error) {
        next(error);
    }
};

/**
 * @desc    Assign a complaint to a staff member
 * @route   PUT /api/complaints/:complaintId/assign
 * @access  Private (Admin/Manager only)
 */
export const assignComplaintToStaff = async(req, res, next) => {
    try {
        const { complaintId } = req.params;
        const{staffId} = req.body;
        const user = req.user;

        if(!staffId) {
            return res.status(400).json({message: 'Staff ID is required'});
        }

        const complaint = await Complaint.findById(complaintId);
        if(!complaint) {
            return res.status(404).json({message: 'Complaint not found'});
        }

        const staffMember = await User.findById(staffId);
        if(!staffMember || staffMember.role !== 'staff') {
            return res.status(404).json({message: 'Staff member not found or user is not a staff'});
        }

        if(user.role === 'manager') {
            const managedBuildings = await Building.find({manager: user._id});
            const managedBuildingsIds = managedBuildings.map( b => b._id.toString());
            if(!managedBuildingsIds.includes(complaint.building.toString())) {
                return res.status(403).json({message: 'You are not authorized to manage this complaint'});
            }
        }

        complaint.assignedTo = staffId;
        complaint.status = 'In Progress';
        await complaint.save();

        const populatedComplaint = await Complaint.findById(complaintId)
            .populate('raisedBy', 'name')
            .populate('assignedTo', 'name email');

        res.status(200).json(populatedComplaint);
    } catch (error) {
        next(error);
    }
};