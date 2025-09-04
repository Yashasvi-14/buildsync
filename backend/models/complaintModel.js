import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A title is required for complaint'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'A description of the issue is required'],
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
            default: 'Pending',
        },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High'],
            default: 'Medium',
        },
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        building: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Building',
        },
        flat: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Flat',
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

export default Complaint;