import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import {
  addCategory,
  getAllCategories,
  getAllColors,
} from "../controllers/categoryController.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
  .route("/")
  .get(getAllCategories)
  .post(jwtVerify, checkUser, superAdminRoleCheck, addCategory);

router.route("/colors").get(getAllColors);
router.route

export default router;