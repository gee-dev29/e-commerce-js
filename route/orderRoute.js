import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
  adminViewOrders,
  createOrderItem,
  getSingleOrder,
  getUserOrders,
  processOrder,
} from "../controllers/orderController.js";
import { checkOrder } from "../middleware/checkOrder.js";
import { checkUser } from "../middleware/checkUser.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
const router = express.Router();

router
  .route("/")
  .get(jwtVerify, checkUser, getUserOrders)
  .post(jwtVerify, checkUser, createOrderItem);

router
  .route("/admin")
  .get(jwtVerify, checkUser, superAdminRoleCheck, adminViewOrders)
  .post(jwtVerify, checkUser, superAdminRoleCheck, processOrder);

router.route("/view").get(jwtVerify, checkOrder, getSingleOrder);



export default router;
