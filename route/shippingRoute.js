import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
  createShippingRate,
  deleteShippingRate,
  getAllShippingRates,
  getShippingrate,
} from "../controllers/shippingController.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, checkUser, superAdminRoleCheck, createShippingRate)
  .get(jwtVerify, checkUser, superAdminRoleCheck, getAllShippingRates)
  .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteShippingRate);

router.route("/rate").get(jwtVerify, getShippingrate);

export default router;
