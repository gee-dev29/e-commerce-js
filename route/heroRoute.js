import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { addHero, getHeros } from "../controllers/heroController.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
    .route("/")
    .post(jwtVerify, checkUser, superAdminRoleCheck, addHero)
    .get(getHeros);

export default router;
