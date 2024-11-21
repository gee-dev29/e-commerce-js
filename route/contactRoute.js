
import express from "express";
import { contactAdmin } from "../controllers/userController";
const router = express.Router();

router
  .route("/")
  .post(contactAdmin)


export default router;
