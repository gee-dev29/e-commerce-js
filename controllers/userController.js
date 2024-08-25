import { UserStatus } from "../enums/statusEnum.js";
import { entity } from "../utils/entity.js";
import { Role } from "../enums/role.js";
import { userModel } from "../interface/userModel.js";
import {
    adminRegisterField,
    loginField,
    registerField,
} from "../utils/inputFields.js";

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const checkFields = entity.checkMissingFieldsInput(
            registerField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const otp = entity.generateOtp();
        const hashPassword = await entity.encryptPassword(password);
        const user = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            otp: otp,
        });
        await user.save();
        return res.status(201).json({
            message: "user created successfuly",
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
//login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for missing or invalid fields
        const checkFields = entity.checkMissingFieldsInput(
            loginField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        // Find the user by email
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Decrypt the password (if applicable)
        const decryptedPassword = entity.decryptPassword(password, user);
        if (!decryptedPassword) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        const payload = {
            id: user._id,
            role: user.role,
        };
        const token = entity.jwtSign(payload);
        // Successful login
        return res.status(200).json({
            token: token,
            message: "Login successful",
            payload: user,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
// register Admin
export const registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const checkFields = entity.checkMissingFieldsInput(
            adminRegisterField,
            req.body
        );
        if (!checkFields.result) {
            return res.status(400).json({
                message: checkFields.message,
            });
        }
        const otp = entity.generateOtp();
        const hashPassword = await entity.encryptPassword(password);
        const user = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            otp: otp,
            role: role,
        });
        await user.save();
        return res.status(201).json({
            message: "Admin created successfuly",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

//get user
export const viewSingleUser = async (req, res) => {
    try {
        return res.status(200).json({ payload: req.user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const viewAllUsers = async (req, res) => {
    try {
        const users = await entity.getAllFilteredData(userModel, {});
        return res.status(200).json({ payload: users });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
//delete User
export const deleteUser = async (req, res) => {
    try {
        await entity.deleteDataById(req.params.id, userModel);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {}
};

//suspend a user
export const toggleSuspendUser = async (req, res) => {
    try {
        const user = req.user;
        if (user.status == UserStatus.ACTIVE) {
            const payload = {
                status: UserStatus.SUSPENDED,
            };
            await entity.updateDataById(req.params.id, payload, userModel);
            return res.status(200).json({
                message: "user suspended successfully",
            });
        }
        const payload = {
            status: UserStatus.ACTIVE,
        };
        await entity.updateDataById(req.params.id, payload, userModel);
        return res.status(200).json({
            message: "user activated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
