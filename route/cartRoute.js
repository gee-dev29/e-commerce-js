import {
    addProductToCart,
    deleteCart,
    getCart,
    updateCart,
} from "../controllers/cartController.js";
import { checkCart } from "../middleware/checkCart.js";
import { checkProduct } from "../middleware/checkProduct.js";
import { checkUser } from "../middleware/checkUser.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";

import express from "express";
const router = express.Router();

router.route("/").post(jwtVerify, checkProduct, addProductToCart);

router
    .route("/:cartId")
    .patch(jwtVerify, checkCart, checkProduct, updateCart)
    .get(jwtVerify, checkCart, getCart)
    .delete(jwtVerify, checkCart, deleteCart);

export default router;
