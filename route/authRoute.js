import express from "express";
import {
  forgotPassword,
  googleLogin,
  googleLogout,
  loginAdmin,
  loginUser,
  registerAdmin,
  registerUser,
  resetPassword,
  verifyOTP,
} from "../controllers/userController.js";
import { checkUser } from "../middleware/checkUser.js";
import { findUserByEmail } from "../middleware/findUserByEmail.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import passport from "passport";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(findUserByEmail, loginUser);
router.get("/login/success", googleLogin);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: 'https://ecommerce-frontend-pi-cyan.vercel.app',
    failureRedirect: "https://ecommerce-frontend-pi-cyan.vercel.app/login",
  })
); 
router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.route("/logout").get(googleLogout);
router.route("/admin").post(findUserByEmail, loginAdmin);
router
  .route("/registerAdmin")
  .post(jwtVerify, checkUser, superAdminRoleCheck, registerAdmin);
router.route("/verify-otp").post(findUserByEmail, verifyOTP);

export default router;
