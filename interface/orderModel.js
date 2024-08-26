const mongoose = require("mongoose");
const { Order } = require("../enums/orderEnum");
const { productModel } = require("./productModel");
const { shippingModel } = require("./shippingModel");

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

        orderedItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: [productModel],
            },
        ],

        shippingInfo: shippingModel.schema,

        paymentMethod: {
            type: String,
            required: true,
        }, // e.g.,

        totalAmount: {
            type: Number,
            required: true,
        },

        orderStatus: {
            type: String,
            enums: [Order.PROCESSING, Order.SHIPPED, Order.DELIVERED],
            default: Order.PROCESSING,
        },
        orderDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
