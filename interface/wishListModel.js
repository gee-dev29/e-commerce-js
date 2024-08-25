const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema(
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
        quantity: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const wishListModel = mongoose.model("wishList", wishListSchema);
