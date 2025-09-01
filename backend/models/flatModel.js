import mongoose from "mongoose";
import Building from "./buildingModel.js";

const flatSchema = new mongoose.Schema(
    {
        flatNumber: {
            type: String,
            required: [true, 'Flat number is required'],
            trim: true,
        },
        building: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Building',
        },
        resident: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Flat = mongoose.model('Flat', flatSchema);

export default Flat;