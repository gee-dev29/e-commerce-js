import mongoose from "mongoose";
import { uploadEnum } from "../enums/uploadEnum.js";

const uploadSchema = new mongoose.Schema({
    creatorId: {
        type: String,
        required: true,
    },
    documentLink: {
        type: String,
        required: true,
    },
    documentType: {
        type: String,
        enum: [
            uploadEnum.ID,
            uploadEnum.PROFILE_PICTURE,
            uploadEnum.PRODUCT_PICTURE,
        ],
        default: uploadEnum.ID,
    },
    fileType: {
        type: String,
        required: true,
    },
    fileSize: {
        type: String,
        required: true,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
});

export const uploadModel = mongoose.model("upload", uploadSchema);
