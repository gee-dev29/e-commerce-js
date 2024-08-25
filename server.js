import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import consola from "consola";
import dotenv from "dotenv";
import authRoute from "./route/authRoute.js";

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
app.use("/api/v1/auth", authRoute);
app.listen(process.env.PORT, () => {
    consola.success({
        message: `Server started on port ${process.env.PORT}`,
        badge: true,
    });
});
