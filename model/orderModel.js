import { orderStatus } from "../enums/orderEnum.js";
import mongoose from "mongoose";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { currency } from "../utils/currency.js";

const orderSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    orderedItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
      },
    ],

    totalAmount: {
      type: Number,
    },

    orderTrackingNumber: {
      type: String,
      required: true,
      unique: true,
    },

    paymentMethod: {
      type: String,
      enums: [PaymentMethod.CASH, PaymentMethod.PAYPAL, PaymentMethod.STRIPE],
      required: true,
    },
    orderStatus: {
      type: String,
      enums: [
        orderStatus.AWAITING_PAYMENT,
        orderStatus.PAID,
        orderStatus.SHIPPED,
        orderStatus.DELIVERED,
        orderStatus.CANCELED,
      ],
      default: orderStatus.AWAITING_PAYMENT,
    },
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "delivery",
    },
    orderNote: {
      type: String,
    },
    shippingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shipping",
    },
    paymentIntentId: {
      type: String,
    },
    canReview: {
      type: Boolean,
      default: false
    },
    currency: {
      type: String,
      default: currency.USD,
      enum: [currency.USD, currency.EUR, currency.NGN],
    },
  },
  { timestamps: true }
);

export const orderModel = mongoose.model("order", orderSchema);
