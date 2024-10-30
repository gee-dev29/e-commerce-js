import express  from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkUser } from "../middleware/checkUser.js";
import {
  createDeliveryAddress,
  deleteDeliveryAddress,
  getUserDeliveryAddress,
} from "../controllers/deliveryController.js";

const router = express.Router();

router
  .route("/")
  .get(jwtVerify, checkUser, getUserDeliveryAddress)
  .post(jwtVerify, checkUser, createDeliveryAddress)
  .delete(jwtVerify, checkUser, deleteDeliveryAddress);

export default router;
