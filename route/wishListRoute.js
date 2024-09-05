import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkProduct } from "../middleware/checkProduct.js";
import { addItemToWishList } from "../controllers/wishListController.js";
const router = express.Router();

router.route("/:wishListId").post(jwtVerify, checkProduct, addItemToWishList);
export default router;
