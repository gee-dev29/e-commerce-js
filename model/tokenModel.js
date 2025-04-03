import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
  
  },
  { timestamps: true }
);

export const tokenModel = mongoose.model("token", tokenSchema);
 