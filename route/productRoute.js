import express from "express";
import { createProduct } from "../controllers/productController.js";
import { checkUser } from "../middleware/checkUser.js";
import { checkProduct } from "../middleware/checkProduct.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
const router = express.Router();

router.route("/").post(
    jwtVerify, 
    createProduct);

export default router;
