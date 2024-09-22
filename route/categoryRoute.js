import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import {
  addCategory,
  getAllCategories,
  getAllColors,
} from "../controllers/categoryController.js";
const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(jwtVerify, superAdminRoleCheck, addCategory);

router.route("/colors").get(getAllColors);

export default router;