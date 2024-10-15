import mongoose from "mongoose";
import { UserStatus } from "../enums/statusEnum.js";
import { Role } from "../enums/role.js";
import { LoginAgents } from "../enums/LoginAgents.js";

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
    role: {
      type: String,
      enums: [Role.ADMIN, Role.SUPER_ADMIN, Role.USER],
      default: Role.USER,
    },
    UserStatus: {
      type: String,
      enum: [UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED],
      default: UserStatus.ACTIVE,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    loginAgent: {
      type: String,
      enum: [LoginAgents.EMAIL, LoginAgents.GOOGLE, LoginAgents.FACEBOOK],
      default: LoginAgents.EMAIL,
    },
  },
  { timestamps: true }
);

export const userModel = mongoose.model("user", userSchema);
