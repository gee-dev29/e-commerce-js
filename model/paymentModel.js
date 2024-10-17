import mongoose from "mongoose";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderStatus } from "../enums/orderEnum.js";

const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  PaymentMethod: {
    type: String,
    enums: [PaymentMethod.PAYPAL, PaymentMethod.STRIPE],
    default: PaymentMethod.PAYPAL,
    required: true,
  },
  paymentRef: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: orderStatus.AWAITING_PAYMENT,
  },
});

export const paymentModel = mongoose.model("payment", paymentSchema);
