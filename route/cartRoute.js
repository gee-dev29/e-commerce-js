import { addProductToCart } from "../controllers/cartController.js";
import { checkProduct } from "../middleware/checkProduct.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";

import express from "express";
const router = express.Router();

router.route("/:productId").post(checkProduct, addProductToCart);

router.route(":id").delete(jwtVerify, checkProduct);

export default router;
