import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
  addItemToWishList,
  deleteWishList,
  getWishlist,
} from "../controllers/wishListController.js";
import { checkUser } from "../middleware/checkUser.js";
const router = express.Router();

router
  .route("/")
  .post(jwtVerify, checkUser, addItemToWishList)
  .get(jwtVerify, checkUser, getWishlist)
  .delete(jwtVerify, deleteWishList);

export default router;
 