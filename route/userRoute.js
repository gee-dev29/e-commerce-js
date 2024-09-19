import {
  deleteUser,
  viewAllUsers,
  viewSingleUser,
} from "../controllers/userController.js";
import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();
router.route("/").get(jwtVerify, checkUser, viewSingleUser);

router.route('/all').get(jwtVerify, checkUser, superAdminRoleCheck, viewAllUsers);

router
  .route("/:id")
  .get(jwtVerify, checkUser, superAdminRoleCheck, viewSingleUser)
  .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteUser);

export default router;
