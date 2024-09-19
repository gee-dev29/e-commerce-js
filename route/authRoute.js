import express from "express";
import {
    loginAdmin,
    loginUser,
    registerAdmin,
    registerUser,
    verifyOTP,
} from "../controllers/userController.js";
import { checkUser } from "../middleware/checkUser.js";
import { findUserByEmail } from "../middleware/findUserByEmail.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(findUserByEmail, loginUser);
router.route("/admin").post(findUserByEmail, loginAdmin);
router.route("/registerAdmin").post(jwtVerify, checkUser, superAdminRoleCheck, registerAdmin);
router.route("/verify-otp").post(findUserByEmail, verifyOTP);

export default router;
