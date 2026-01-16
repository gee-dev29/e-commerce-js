import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    hex: {
        type: String,
        required: true,
      },
  }
);

export const colorModel = mongoose.model("color", colorSchema);
 