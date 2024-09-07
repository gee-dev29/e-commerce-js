import express from "express";
import {
    loginUser,
    registerUser,
    verifyOTP,
} from "../controllers/userController.js";
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/:id/login").post(checkUser, loginUser);
router.route("/:id/verify-otp").post(checkUser, verifyOTP);

export default router;
