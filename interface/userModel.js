const mongoose = require("mongoose");
const Role = require("../enums/role");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
        },
        address: {
            type: String,
        },
        profilePicture: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        otp: {
            type: {
                code: {
                    type: String,
                },
                expiresIn: {
                    type: Date,
                },
            },
        },
        role: {
            type: String,
            enums: [, Role.ADMIN, Role.SUPER_ADMIN, Role.USER],
            default: Role.USER,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
