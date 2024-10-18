import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
    createShipping,
    deleteShippingRate,
    viewShippingInfo,
    viewShippingInfos,
} from "../controllers/shippingController.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
const router = express.Router();

router
    .route("/create-shipping")
    .post(jwtVerify, createShipping)
    .get(jwtVerify, viewShippingInfos);
router
    .route("/:shippingId")
    .get(jwtVerify, checkShippingInfo, viewShippingInfo);

router.route("/").delete(jwtVerify, deleteShippingRate);

export default router;
