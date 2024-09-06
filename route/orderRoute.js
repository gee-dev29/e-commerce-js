import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkCart } from "../middleware/checkCart.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
import { orderItem } from "../controllers/orderController.js";
import { checkProduct } from "../middleware/checkProduct.js";
const router = express.Router();

router
    .route("/:cartId/:shippingId")
    .post(jwtVerify, checkCart, checkShippingInfo, orderItem);

export default router;
