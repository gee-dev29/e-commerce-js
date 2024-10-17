import mongoose from "mongoose";
import { currency } from "../utils/currency.js";

const shippingSchema = new mongoose.Schema(
    {
        shippingRate: {
            type: String,
            required: true,
        },
        continent: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const shippingModel = mongoose.model("shipping", shippingSchema);
