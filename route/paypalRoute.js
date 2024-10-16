import express from "express";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { captureOrder, createOrder} from "../controllers/paymentController.js";
const router = express.Router();

// router
//   .route("/create-order")
//   .post(jwtVerify, checkUser, createStripeSession);
// router
//   .route("/webhook")
//   .post(jwtVerify, checkUser, getStripeWebhook);


router.route("/create-order").post(jwtVerify, checkUser, createOrder);
router.route("/capture-order").post(jwtVerify, checkUser, captureOrder);

export default router;
