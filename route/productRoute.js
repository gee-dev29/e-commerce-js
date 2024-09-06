import express from "express";
import {
    createProduct,
    deleteProduct,
    updateProduct,
    viewProduct,
    viewProducts,
} from "../controllers/productController.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkProduct } from "../middleware/checkProduct.js";
const router = express.Router();

router.route("/").post(jwtVerify, createProduct).get(jwtVerify, viewProducts);

router
    .route("/:productId")
    .get(jwtVerify, checkProduct, viewProduct)
    .delete(jwtVerify, checkProduct, deleteProduct)
    .patch(jwtVerify, checkProduct, updateProduct);
export default router;
