import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import { checkProduct } from "../middleware/checkProduct.js";
import {
  addItemToWishList,
  deleteWishList,
  updateWishList,
  viewWishList,
} from "../controllers/wishListController.js";
import { checkWishList } from "../middleware/checkWishList.js";
import { findWishList } from "../middleware/FindWishList.js";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, checkProduct, findWishList, addItemToWishList)
  .get(jwtVerify, checkWishList, viewWishList);
  
router
  .route("/:wishListId")
  .patch(jwtVerify, checkWishList, updateWishList)
  .delete(jwtVerify, checkWishList, deleteWishList);
export default router;
