import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import {
    addCategory,
    deleteCategory,
    getAllCategories,
    getAllColors,
} from "../controllers/categoryController.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
    .route("/:id?")
    .get(getAllCategories)
    .post(jwtVerify, checkUser, superAdminRoleCheck, addCategory);

router
    .route("/")
    .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteCategory);

export default router;
