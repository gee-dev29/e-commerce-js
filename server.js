import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import consola from "consola";
import dotenv from "dotenv";
import authRoute from "./route/authRoute.js";
import userRoute from "./route/userRoute.js";
import cartRoute from "./route/cartRoute.js";
import wishListRoute from "./route/wishListRoute.js";
import shippingRoute from "./route/shippingRoute.js";
import productRoute from "./route/productRoute.js";
import categoryRoute from "./route/categoryRoute.js";
import orderRoute from "./route/orderRoute.js";
import heroRoute from "./route/heroRoute.js";
import stripeRoute from "./route/stripeRoute.js";
import colorsRoute from "./route/colorsRoute.js";
import countriesRoute from "./route/countryRoute.js";
import dbConnection from "./connection/dbConnection.js";
import passport from "passport";
import cookieSession from "cookie-session";
import * as passportMain from "./passportSetup.js";
// import { swaggerApi } from "./swaggerDoc.js";

const app = express();

// const options = {
//     swaggerOptions
// }

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
app.use(bodyParser.json({ limit: "100mb" }));

// combineRoute();
dbConnection();

// swaggerApi(app)
app.use(passport.initialize());
app.use(
  cookieSession({
    name: "session",
    keys: ["kncloset"],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(passport.session( ))
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/wishList", wishListRoute);
app.use("/api/v1/shipping", shippingRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/hero", heroRoute);
app.use("/api/v1/colors", colorsRoute);
app.use("/api/v1/countries", countriesRoute);
app.use("/api/v1/stripe", stripeRoute);
app.use("/api/v1/ping", (req, res) => {
  res.send("welcome to kncloset");
});

app.listen(process.env.PORT || 8920, () => {
  consola.success({
    message: `Server started on port ${process.env.PORT || 8920}`,
    badge: true,
  });
});
