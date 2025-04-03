import {
  deleteUser,
  getPendingVsPaidSummary,
  toggleSuspendUser,
  userAnalytics,
  viewAllUsers,
  viewSingleUser,
} from "../controllers/userController.js";
import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();
router
  .route("/")
  .get(jwtVerify, checkUser, viewSingleUser)
  .post(jwtVerify, checkUser, superAdminRoleCheck, toggleSuspendUser)
  .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteUser);

router
  .route("/all")
  .get(jwtVerify, checkUser, superAdminRoleCheck, viewAllUsers);

router
  .route("/analytics")
  .get(jwtVerify, checkUser, superAdminRoleCheck, userAnalytics);

router
  .route("/sales-analytics")
  .get(jwtVerify, checkUser, superAdminRoleCheck, getPendingVsPaidSummary);


// router
// .route("/:id")
// .get(jwtVerify, checkUser, superAdminRoleCheck, viewSingleUser);

export default router;
 