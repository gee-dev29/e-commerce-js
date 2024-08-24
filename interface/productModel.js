const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        productTitle: {
            type: String,
            required: true,
        },
        productDescription: {
            type: String,
            required: true,
        },
        productPrice: {
            type: Number,
            required: true,
        },
        productDiscount: {
            type: Number,
            required: true,
        },
        productCategory: {
            type: Number,
            required: true,
        },
        productColors: {
            type: Array,
            required: true,
        },
        productSize: {
            type: Array,
            required: true,
        },
        productImages: {
            type: Array,
            required: true,
        },
        productstock: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);
