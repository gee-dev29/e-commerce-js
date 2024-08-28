import express from "express";
import { createProduct } from "../controllers/productController.js";
import { checkUser } from "../middleware/checkUser.js";
import { checkProduct } from "../middleware/checkProduct.js";
const router = express.Router();

router.route("/:id").post(checkUser, createProduct);

export default router;
