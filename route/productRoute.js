import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductByCategory,
  getProductBySubcategory,
  getProductsColors,
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
router.route("/colors").get(getProductsColors);
router.route("/sort").get(getProductsSortedByPrice);
router.route("/categories").get(getProductByCategory);
router.route("/subcategories").get(getProductBySubcategory);

router.route("/detail/:productId").get(checkProduct, viewProduct);

export default router;
