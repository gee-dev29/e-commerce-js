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
  .get(getAllCategories)
  .post(jwtVerify, superAdminRoleCheck, addCategory)

export default router;
