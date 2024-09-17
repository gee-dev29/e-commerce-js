import express from "express";
import { jwtVerify } from "../middleware/jwtAuthentication.js";
import {
    getProfilePic,
    uploadProfilePicture,
} from "../controllers/uploadController.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();

router
    .route("/")
    .post(jwtVerify, upload.single("file"), uploadProfilePicture)
    .get(jwtVerify, getProfilePic);

export default router;
