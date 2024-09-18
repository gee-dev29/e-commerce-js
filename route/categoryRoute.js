import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import {
  addCategory,
  getAllCategories,
} from "../controllers/categoryController.js";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, superAdminRoleCheck, addCategory)
  .get(getAllCategories);

export default router;
