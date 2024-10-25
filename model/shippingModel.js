import mongoose from "mongoose";
import { currency } from "../utils/currency.js";

const shippingSchema = new mongoose.Schema(
    {
        shippingRate: {
            type: Number,
            required: true,
        },
        subregion: {
            type: String,
            required: true,
        },
        currency: {
            type: String,
            default: currency.USD,
            enums: [currency.EUR, currency.NGN, currency.USD]
        },
    },
    { timestamps: true }
);

export const shippingModel = mongoose.model("shipping", shippingSchema);
