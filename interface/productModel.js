import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        // productId: {
        //     type: String,
        //     required: true,
        //     unique: true,
        //     default: () => uuidv4() // Generate UUID as default value
        // },
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
        },
        productCategory: {
            type: String,
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
        productStock: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const productModel = mongoose.model("product", productSchema);
