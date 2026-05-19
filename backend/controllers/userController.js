import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import Building from "../models/buildingModel.js";
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
/**
 * @desc    Register a new user
 * @route   POST /api/users/register
 * @access  Public
 */
const PUBLIC_REGISTER_ROLES = ["resident", "staff"];

export const registerUser = async (req, res, next) => {
    try{
        const { name, email, password, role, buildingCode }=req.body;

        if(!name || !email || !password) {
            return res.status(400).json({message: "Please enter all fields"});
        }

        const requestedRole = role || "resident";
        if (!PUBLIC_REGISTER_ROLES.includes(requestedRole)) {
            return res.status(403).json({
                message: "Only residents and staff can self-register. Admin and manager accounts must be created by an administrator.",
            });
        }

        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({message: "User already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // buildingCode is required for all public registrations
        if (!buildingCode) {
            return res.status(400).json({ message: "Building code is required" });
        }
        const building = await Building.findOne({ buildingCode: buildingCode.toUpperCase() });
        if (!building) {
            return res.status(400).json({ message: "Invalid building code" });
        }
        const pendingBuilding = building._id;

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: requestedRole,
            pendingBuilding,
            isApproved: false,
        });

        if(newUser) {
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                pendingBuilding: newUser.pendingBuilding,
                isApproved: newUser.isApproved,
            });
        } else {
            res.status(400).json({message: "Invalid user data"});
        }
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/users/login
 * @access  Public
 */
export const loginUser = async (req,res,next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({message: 'Please enter all fields'});
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!user.isApproved) {
            return res.status(403).json({
                message: "Your account is pending approval. Please wait for your building manager or admin to approve you.",
            });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
        });
    } catch(error) {
        next(error);
    }
};

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("assignedBuilding", "name")
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Profile error:", error.message); // 🔥 IMPORTANT
    next(error);
  }
};

/**
 * @desc    Upload or update user profile picture
 * @route   PUT /api/users/profile/picture
 * @access  Private
 */
export const uploadProfilePictures = async (req, res, next) => {
    try {
        if(!req.file) {
            return res.status(400).json({message: 'No file uploaded.'});
        }

        const b64 = Buffer.from(req.file.buffer).toString('base64');
        let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'buildsync_profiles',
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { profilePicture: result.secure_url },
            { new: true, runValidaters: true }
        ).select('-password');

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all users pending approval
 * @route   GET /api/admin/pending-users
 * @access  Private (Admin, Manager)
 */
export const getPendingUsers = async (req, res, next) => {
    try {
        let filter = { isApproved: false };

        if (req.user.role === "manager") {
            const managedBuildings = await Building.find({ manager: req.user._id });
            const buildingIds = managedBuildings.map((b) => b._id);

            filter = {
                isApproved: false,
                role: { $in: ["resident", "staff"] },
                pendingBuilding: { $in: buildingIds },
            };
        }

        const users = await User.find(filter).populate("pendingBuilding", "name buildingCode");
        res.json(users);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve a pending user and assign building
 * @route   PATCH /api/admin/approve-user/:id
 * @access  Private (Admin, Manager)
 */
export const approveUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isApproved) {
            return res.status(400).json({ message: "User is already approved" });
        }

        if (req.user.role === "manager") {
            if (!["resident", "staff"].includes(user.role)) {
                return res.status(403).json({
                    message: "Managers can only approve residents and staff",
                });
            }

            const managedBuildings = await Building.find({ manager: req.user._id });
            const buildingIds = managedBuildings.map((b) => b._id.toString());

            if (
                !user.pendingBuilding ||
                !buildingIds.includes(user.pendingBuilding.toString())
            ) {
                return res.status(403).json({
                    message: "You can only approve users for buildings you manage",
                });
            }
        }

        if (req.user.role === "admin" && user.role === "admin") {
            return res.status(403).json({
                message: "Admin accounts cannot be approved through this endpoint",
            });
        }

        user.isApproved = true;
        user.assignedBuilding = user.pendingBuilding;
        user.pendingBuilding = null;

        await user.save();

        res.json({ message: "User approved successfully", userId: user._id });
    } catch (error) {
        next(error);
    }
};

export const getBuildingUsers = async (req, res, next) => {
  try {
    const user = req.user;

    let users;

    // ADMIN → all users
    if (user.role === "admin") {
      users = await User.find({})
        .populate("assignedBuilding", "name")
        .select("-password");
    }

    // MANAGER → users of managed buildings
    else if (user.role === "manager") {
      const buildings = await Building.find({ manager: user._id });
      const buildingIds = buildings.map((b) => b._id);

      users = await User.find({
        assignedBuilding: { $in: buildingIds },  // ✅ FIXED
      })
        .populate("assignedBuilding", "name")
        .select("-password");
    }

    // RESIDENT → users of same building
    else {
      users = await User.find({
        assignedBuilding: user.assignedBuilding, // ✅ FIXED
      })
        .populate("assignedBuilding", "name")
        .select("-password");
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};