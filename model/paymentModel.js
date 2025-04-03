import mongoose from "mongoose";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderStatus } from "../enums/orderEnum.js";

const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  creatorId: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  paymentRef: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    default: orderStatus.AWAITING_PAYMENT,
  },
});

export const paymentModel = mongoose.model("payment", paymentSchema);
 