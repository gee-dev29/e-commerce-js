import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication";
import { checkUser } from "../middleware/checkUser";
import { superAdminRoleCheck } from "../middleware/checkRole";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, checkUser)
  .get()
  .delete(jwtVerify, checkUser, superAdminRoleCheck)

export default router;
