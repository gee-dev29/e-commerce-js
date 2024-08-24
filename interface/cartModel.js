const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("cart", cartSchema)