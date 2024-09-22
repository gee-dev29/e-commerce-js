import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    }
})

export const heroModel = mongoose.model("hero", heroSchema)