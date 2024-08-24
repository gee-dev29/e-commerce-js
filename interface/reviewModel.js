const mongoose = require("mongoose");

const reviewSchema = new mongoose(
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
        reviewTitle: {
            type: String,
            required: true,
        },
        reviewComment: {
            type: String,
            required: true,
        },
        isApproved: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("review", reviewSchema)