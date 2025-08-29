import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please add a name"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Please add an email"],
            unique: true,
            trim: true,
            lowercase: true,
        },

        password: {
            type: String,
            required: [true, "Please set a password"],
        },

        role: {
            type: String,
            enum: ["resident", "manager", "admin", "staff"],
            defult: "resident",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;