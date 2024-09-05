import express from "express";
import {
    loginUser,
    registerUser,
    viewSingleUser,
} from "../controllers/userController.js";
import { checkUser } from "../middleware/checkUser.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

export default router;
