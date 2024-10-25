import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
  createShippingRate,
  deleteShippingRate,
  getAllShippingRates,
  getShippingrate,
} from "../controllers/shippingController.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, checkUser, superAdminRoleCheck, createShippingRate)
  .get(jwtVerify, getAllShippingRates)
  .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteShippingRate);
  
  router
  .route("/rate")
  .get(jwtVerify, checkShippingInfo, getShippingrate);

export default router;
