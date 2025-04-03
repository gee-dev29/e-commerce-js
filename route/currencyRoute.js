import express from "express";
import { getCurrencyRate } from "../controllers/countryController.js";
const router = express.Router();

router.route("/").get(getCurrencyRate);

export default router;
 