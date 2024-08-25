import { UserStatus } from "../enums/statusEnum.js";
import { entity } from "../utils/entity.js";
import { Role } from "../enums/role.js";
import { userModel } from "../interface/userModel.js";

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        entity.checkMissingFieldsInput([firstName, lastName, email, password]);
        // const otp = entity.generateOtp();
        // const user = new userModel({
        //     firstName: firstName,
        //     lastName: lastName,
        //     email: email,
        //     password: entity.encryptPassword(password),
        //     otp: otp,
        // });
        // await user.save();
        // return res.status(201).json({
        //     message: "user created successfuly",
        // });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
//login user
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await entity.userLogin(req.body);
        if (!userDetails) {
            return res.status(400).json({
                message: "Invalid credentials",
            });
        }
        entity.decryptData(password, userModel);
        const user = await userModel
            .findOne({ email: email })
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const isMatch = await entity.comparePassword(password, user.password);
        if (!isMatch && user.status !== Role.USER) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        return res.status(200).json({
            message: "Login successful",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
// register Admin
export const registerAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const otp = entity.generateOtp();
        const user = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: entity.encryptPassword(password),
            otp: otp,
            status: Role.ADMIN,
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
// login Admin
export const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await entity.userLogin(req.body);
        if (!userDetails) {
            return res.status(400).json({
                message: "Invalid admin credentials",
            });
        }
        await entity.decryptData(password, userModel);
        const user = await userModel
            .findOne({ email: email })
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "Admin not found",
            });
        }
        const isMatch = await entity.comparePassword(password, user.password);
        if (!isMatch && user.status !== Role.ADMIN) {
            return res.status(401).json({
                message: "Invalid admin credentials",
            });
        }
        // Create a token
        const { userId, ...data } = _doc;
        const token = jwtSign(userId);
        return res.status(200).json({
            token: token,
            data: data,
            status: 200,
            success: true,
        });
        return res.status(200).json({
            message: "Login successful",
            user,
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
        const user = await findById(req.id)
            .where({ status: Role.USER })
            .select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const viewAllUsers = async (req, res) => {
    try {
        const user = await find()
            .where({ status: Role.USER })
            .select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};
//delete User
export const deleteUser = async (req, res) => {
    try {
        const user = await findByIdAndDelete().where({ id: req.params.id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {}
};
//get admin user
export const getAdmin = async (req, res) => {
    try {
        const admin = await findById(req.id)
            .where({ status: Role.ADMIN })
            .select("-password");
        if (!user) {
            return res.status(404).json({ message: "Admin not found" });
        }
        status;
        return res.status(200).json({ admin });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

// export const registerAdmin = async (req, res) => {
//     try {
//         const { firstName, lastName, email, password } = req.body;
//         const otp = entity.generateOtp();
//         const user = new userModel({
//             firstName: firstName,
//             lastName: lastName,
//             email: email,
//             password: entity.encryptPassword(password),
//             otp: otp,
//             status: Role.ADMIN,
//         });
//         await user.save();
//         return res.status(201).json({
//             message: "Admin created successfuly",
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal server error",
//         });
//     }
// };
// // login Admin
// export const loginAdmin = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const userDetails = await entity.userLogin(req.body);
//         if (!userDetails) {
//             return res.status(400).json({
//                 message: "Invalid admin credentials",
//             });
//         }
//         await entity.decryptData(password, userModel);
//         const user = await userModel
//             .findOne({ email: email })
//             .select("-password");
//         if (!user) {
//             return res.status(404).json({
//                 message: "Admin not found",
//             });
//         }
//         const isMatch = await entity.comparePassword(password, user.password);
//         if (!isMatch && user.status !== Role.ADMIN) {
//             return res.status(401).json({
//                 message: "Invalid admin credentials",
//             });
//         } else {
//             // Create a token
//             const { userId, ...data } = _doc;
//             const token = jwtSign(userId);
//             return res.status(200).json({
//                 token: token,
//                 data: data,
//                 status: 200,
//                 success: true,
//             });
//         }
//         return res.status(200).json({
//             message: "Login successful",
//             user,
//         });
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal server error",
//         });
//     }
// };
//suspend a user
export const suspendUser = async (req, res) => {
    try {
        const user = req.user;
        if (user.status == UserStatus.SUSPENDED) {
            return res.status(400).json({
                message: "User already suspended",
            });
        }
        const suspendUser = new user.findByIdAndUpdate({
            id: req.params.id,
        }).where({ status: UserStatus.SUSPENDED });
        await user.save(suspendUser);
        return res.status(200).json({
            message: "user suspended successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
