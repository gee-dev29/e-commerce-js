import mongoose from "mongoose";

const shippingSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
        shippingTrackingNumber: {
            type: String,
            required: true,
        },
        shippingAddress: {
            type: String,
            required: true,
        },
        shippingCountry: {
            type: String,
            required: true,
        },
        shippingNote: {
            type: String,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const shippingModel = mongoose.model("shipping", shippingSchema);
