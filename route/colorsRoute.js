import express from "express";
import {
  getAllColors,
} from "../controllers/categoryController.js";
const router = express.Router();


router.route("/").get(getAllColors);
router.route

export default router; 