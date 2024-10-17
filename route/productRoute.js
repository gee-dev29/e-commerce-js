import express from "express";
import {
    createProduct,
    deleteProduct,
    searchProduct,
    viewProduct,
    viewProducts,
} from "../controllers/productController.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkProduct } from "../middleware/checkProduct.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router.route("/").post(jwtVerify, createProduct).get(viewProducts);
router.route("/search/product").get(jwtVerify, checkUser, searchProduct);

router
    .route("/:productId")
    .get(checkProduct, viewProduct)
    .delete(jwtVerify, superAdminRoleCheck, checkProduct, deleteProduct);

export default router;
