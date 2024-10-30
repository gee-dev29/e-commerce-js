import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
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
        country: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        zipCode: {
            type: String,
            required: true,
        },
      
    },
    { timestamps: true }
);

export const deliveryModel = mongoose.model("delivery", deliverySchema);
