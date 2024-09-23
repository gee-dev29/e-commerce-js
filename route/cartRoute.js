import {
    addProductsToCart,
    addProductToCart,
    deleteCart,
    getCart,
    updateCart,
} from "../controllers/cartController.js";
import { checkCart } from "../middleware/checkCart.js";
import { checkProduct, checkProducts } from "../middleware/checkProduct.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";

import express from "express";
const router = express.Router();

router
    .route("/")
    .post(jwtVerify, checkProducts, addProductsToCart)
    .get(jwtVerify, getCart);

router
    .route("/:cartId")
    .patch(jwtVerify, checkCart, checkProduct, updateCart)
    .delete(jwtVerify, checkCart, deleteCart)
    .post();

export default router;
