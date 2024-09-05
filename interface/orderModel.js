import mongoose from "mongoose";
import { Order } from "../enums/orderEnum";
import { shippingModel } from "./shippingModel";

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
        orderedItems: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
        ],

        shippingInfo: shippingModel.schema,

        paymentMethod: {
            type: String,
            required: true,
        },

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

export const orderModel = mongoose.model("order", orderSchema);
