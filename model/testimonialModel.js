import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      rating: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const testimonialModel = mongoose.model("testimonial", testimonialSchema);
