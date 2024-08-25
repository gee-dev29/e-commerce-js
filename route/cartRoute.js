import { addItemToCart } from "../controllers/cartController.js";
import { checkProduct } from "../middleware/checkProduct.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";

import express from "express";
const router = express.Router();

router.route("/").get(jwtVerify).post(jwtVerify, checkProduct, addItemToCart);

router.route(":id").delete(jwtVerify);

export default router;
