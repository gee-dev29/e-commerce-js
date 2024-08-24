const mongoose = require("mongoose");
const { Order } = require("../enums/orderEnum");

const orderSchema = new mongoose.Schema(
    {
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        shippingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "shipping",
            required: true,
        },
        orderStatus: {
            type: String,
            default: Order.PROCESSING,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema)