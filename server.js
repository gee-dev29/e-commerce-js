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
import subcategoryRoute from "./route/subcategoryRoute.js";
import orderRoute from "./route/orderRoute.js";
import heroRoute from "./route/heroRoute.js";
import deliveryRoute from "./route/deliveryRoute.js";
import stripeRoute from "./route/stripeRoute.js";
import colorsRoute from "./route/colorsRoute.js";
import countriesRoute from "./route/countryRoute.js";
import currencyRateRoute from "./route/currencyRoute.js";
import reviewRoute from "./route/reviewRoute.js";
import dbConnection from "./connection/dbConnection.js";
import passport from "passport";
import cookieSession from "cookie-session";
import paypalRoute from "./route/paypalRoute.js";
import * as passportMain from "./passportSetup.js";
import cron from "node-cron";
import { fetchCurrencyRates } from "./controllers/countryController.js";

const app = express();


dotenv.config();

// middleware
app.use(
  cors({
    origin: [
      "https://superuser.knclosets.com",
      "https://knclosets.com",
      "https://admin.knclosets.com",
      "https://ecommerce-dashboard-hazel-kappa.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: "GET,POST,PUT,DELETE ",
    credentials: true,
  })
);
app.use(
  cookieSession({
    name: "session",
    keys: ["kncloset"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  if (req.originalUrl.includes("webhook")) {
    express.raw({ type: "application/json" })(req, res, next);
  } else {
    bodyParser.urlencoded({
      limit: "100mb",
      extended: true,
      parameterLimit: 50000,
    })(req, res, (err) => {
      if (err) return next(err); // Handle error
      bodyParser.json({ limit: "100mb" })(req, res, next);
    });
  }
});
// combineRoute();
dbConnection();

// swaggerApi(app)

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/wishList", wishListRoute);
app.use("/api/v1/shipping", shippingRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/subcategory", subcategoryRoute);
app.use("/api/v1/hero", heroRoute);
app.use("/api/v1/colors", colorsRoute);
app.use("/api/v1/delivery", deliveryRoute);
app.use("/api/v1/countries", countriesRoute);
app.use("/api/v1/stripe", stripeRoute);
app.use("/api/v1/paypal", paypalRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/rate", currencyRateRoute);
app.use("/api/v1/ping", (req, res) => {
  res.send("welcome to kncloset");
});



cron.schedule("0 0 * * *", fetchCurrencyRates);

app.listen(process.env.PORT || 8920, () => {
  consola.success({
    message: `Server started on port ${process.env.PORT || 8920}`,
    badge: true,
  });
});
