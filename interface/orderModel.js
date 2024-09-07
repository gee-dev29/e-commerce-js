import { orderStatus } from "../enums/orderEnum.js";
import mongoose from "mongoose";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";

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
                required: true,
            },
        ],

        orderTrackingNumber: {
            type: String,
            required: true,
            unique: true,
        },
        
        paymentMethod: {
            type: String,
            enums: [PaymentMethod.CASH, PaymentMethod.CREDIT_CARD, PaymentMethod.PAYPAL, PaymentMethod.STRIPE],
            required: true,
        },

        totalAmount: {
            type: Number,
            required: true,
        },

        orderStatus: {
            type: String,
            enums: [
                orderStatus.PROCESSING,
                orderStatus.SHIPPED,
                orderStatus.DELIVERED,
            ],
            default: orderStatus.PROCESSING,
        },

        orderDate: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
