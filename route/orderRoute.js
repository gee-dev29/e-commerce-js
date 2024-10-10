import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
    adminViewOrders,
    changeOrderStatus,
    createOrderItem,
    viewOrder,
    viewOrders,
} from "../controllers/orderController.js";
import { checkOrder } from "../middleware/checkOrder.js";
import { checkUser } from "../middleware/checkUser.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();

router
    .route("/")
    .get(jwtVerify, viewOrders)
    .post(jwtVerify, checkUser, createOrderItem);

router
    .route("/admin")
    .get(jwtVerify, checkUser, superAdminRoleCheck, adminViewOrders);
// router
//     .route("/:cartId/:shippingId")
//     .post(jwtVerify, checkCart, checkShippingInfo, orderItem);

router
    .route("/view/:orderId")
    .get(jwtVerify, checkOrder, viewOrder)
    .patch(jwtVerify, checkOrder, changeOrderStatus);

export default router;
