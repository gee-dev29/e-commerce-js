import express from "express";
import authRoute from "./authRoute";
const app = express.Router();

module.exports.combineRoute = () => {
    app.use("/api/v1/auth", authRoute);
};
