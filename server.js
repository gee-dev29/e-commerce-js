const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { success, error } = require("consola");
const app = express();

require("dotenv").config();

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

app.listen(process.env.PORT, () => {
    success({
        message: `Server started on port ${process.env.PORT}`,
        badge: true,
    });
});
