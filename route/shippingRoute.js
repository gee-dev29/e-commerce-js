import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
    createShippingInfo,
    updateShippingInfo,
    viewShippingInfo,
    viewShippingInfos,
} from "../controllers/shippingController.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
const router = express.Router();

router
    .route("/")
    .post(jwtVerify, createShippingInfo)
    .get(jwtVerify, viewShippingInfos);
router
    .route("/:shippingId")
    .patch(jwtVerify, checkShippingInfo, updateShippingInfo)
    .get(jwtVerify, checkShippingInfo, viewShippingInfo);

export default router;
