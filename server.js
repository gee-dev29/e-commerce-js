import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import consola from "consola";
import dotenv from "dotenv";
import authRoute from "./route/authRoute.js";
import userRoute from "./route/userRoute.js";
import cartRoute from "./route/cartRoute.js";
import wishListRoute from "./route/wishListRoute.js";
import productRoute from "./route/productRoute.js";
import dbConnection from "./connection/dbConnection.js";

const app = express();

dotenv.config();

// middleware
app.use(cors());
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true,
        parameterLimit: 50000,
    })
);
app.use(bodyParser.json({ limit: "50mb" }));

// combineRoute();
dbConnection();
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/wishList", wishListRoute);
app.listen(process.env.PORT, () => {
    consola.success({
        message: `Server started on port ${process.env.PORT}`,
        badge: true,
    });
});
