import mongoose from "mongoose";
import { currency } from "../utils/currency.js";

const shippingSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        shippingTrackingNumber: {
            type: String,
            required: true,
        },
        shippingAddress: [
            {
                street: {
                    type: String,
                    required: true,
                },
                city: {
                    type: String,
                    required: true,
                },
                state: {
                    type: String,
                    required: true,
                },
                zipCode: {
                    type: String,
                    required: true,
                },
            },
        ],
        shippingCountry: {
            type: String,
            required: true,
        },
        shippingNote: {
            type: String,
        },
        shippingFee: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            required: true,
            enum: [currency.USD, currency.EUR, currency.NGN],
        },
        freeDelivery: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const shippingModel = mongoose.model("shipping", shippingSchema);
