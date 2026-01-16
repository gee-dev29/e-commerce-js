import mongoose from "mongoose";

const currencySchema = new mongoose.Schema(
  {
    base: {
      type: String,
    },
    rates: Object,
    date: Date,
  },
  {
    timestamps: true,
  }
);

export const currencyRateModel = mongoose.model(
  "currencyRates",
  currencySchema
);
 