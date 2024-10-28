import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductsSortedByPrice,
  searchProduct,
  viewProduct,
} from "../controllers/productController.js";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkProduct } from "../middleware/checkProduct.js";
import { superAdminRoleCheck } from "../middleware/checkRole.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, checkUser, superAdminRoleCheck, createProduct)
  .get(getAllProducts)
  .delete(jwtVerify, checkUser, superAdminRoleCheck, deleteProduct);
router.route("/search").get(searchProduct);
router.route("/sort").get(getProductsSortedByPrice);

router.route("/detail/:productId").get(checkProduct, viewProduct);

export default router;
