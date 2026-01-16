import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { checkUser } from "../middleware/checkUser.js";
import { addSubCategory, deleteSubCategory, getAllSubCategories } from "../controllers/subcategoryController.js";
const router = express.Router();

router
    .route("/:id?")
    .get(getAllSubCategories)
    .post(jwtVerify, checkUser, superAdminRoleCheck, addSubCategory);

router
    .route("/")
    .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteSubCategory);

export default router;
 