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
        buildingCode: {
            type: String,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);
// Generate unique building code before saving
buildingSchema.pre("save", function (next) {
  if (!this.buildingCode) {
    const prefix = this.name.substring(0, 3).toUpperCase();
    const random = Math.floor(100 + Math.random() * 900);
    this.buildingCode = `${prefix}${random}`;
  }
  next();
});
const Building = mongoose.model('Building', buildingSchema);

export default Building;