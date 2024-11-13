import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkUser } from "../middleware/checkUser.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import {
  updateReview,
  createReview,
  getAllReviews,
  getUserProductReviews,
} from "../controllers/reviewController.js";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, checkUser, createReview)
  .get(jwtVerify, checkUser, getUserProductReviews)
  .put(jwtVerify, checkUser, superAdminRoleCheck, updateReview);

router
  .route("/all")
  .get(jwtVerify, checkUser, superAdminRoleCheck, getAllReviews);
export default router;
