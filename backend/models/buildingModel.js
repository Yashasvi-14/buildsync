import mongoose from 'mongoose';

const buildingSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Building name is required'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        manager: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

const Building = mongoose.model('Building', buildingSchema);

export default Building;