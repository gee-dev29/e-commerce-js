import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
  createStripeSession,
  getStripeWebhook,
} from "../controllers/paymentController.js";
import { stripeData } from "../middleware/stripeBody.js";
const router = express.Router();

router
  .route("/create-checkout-session")
  .post(jwtVerify, checkUser, createStripeSession);

router.route("/webhook").post(getStripeWebhook);

export default router;
 