import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
    createShipping,
    deleteShippingRate,
    viewShippingInfo,
    viewShippingInfos,
} from "../controllers/shippingController.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
    .route("/create-shipping")
    .post(jwtVerify, createShipping)
    .get(jwtVerify, viewShippingInfos);
router
    .route("/:shippingId")
    .get(jwtVerify, checkShippingInfo, viewShippingInfo);

router
    .route("/")
    .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteShippingRate);

export default router;
