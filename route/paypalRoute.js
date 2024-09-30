import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { createStripeSession, getStripeWebhook } from "../controllers/paymentController.js";
const router = express.Router();

router
  .route("/create-order")
  .post(jwtVerify, checkUser, createStripeSession);
router
  .route("/webhook")
  .post(jwtVerify, checkUser, getStripeWebhook);

export default router;
