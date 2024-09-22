import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication";
import { superAdminRoleCheck } from "../middleware/checkRole";
import { addHero, getHeros } from "../controllers/heroController";
const router = express.Router();

router.route("/").post(jwtVerify, superAdminRoleCheck, addHero).get(getHeros);

export default router