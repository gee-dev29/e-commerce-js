import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkCart } from "../middleware/checkCart.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
import {
    orderItem,
    viewOrder,
    viewOrders,
} from "../controllers/orderController.js";
import { checkOrder } from "../middleware/checkOrder.js";
const router = express.Router();

router
    .route("/:cartId/:shippingId")
    .post(jwtVerify, checkCart, checkShippingInfo, orderItem)
    
    router.route("/:orderId").get(jwtVerify, checkOrder, viewOrder);

router.route("/").get(jwtVerify, viewOrders);

export default router;
