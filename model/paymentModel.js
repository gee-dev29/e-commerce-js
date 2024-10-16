import mongoose from "mongoose";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";

const paymentSchema = new mongoose.Schema({
  creatorId: {
    type: String,
    required: true,
  },
  PaymentMethod: {
    type: String,
    enums: [PaymentMethod.PAYPAL || PaymentMethod.STRIPE],
    default: PaymentMethod.PAYPAL,
    required: true,
  },
  paymentRef: {
    type: String,
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
});

export const paymentModel = mongoose.model("payment", paymentSchema);
