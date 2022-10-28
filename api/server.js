require("dotenv").config();

const PORT = process.env.PORT ?? 8080;
const HOST = process.env.HOST ?? 'localhost';

const express = require('express');
const cookieParser = require("cookie-parser");

const router = require('./routers/router');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);

exports.runService = function () {
    app.listen(PORT, HOST, () => console.log(`http://${HOST}:${PORT}`));
}

exports.server = app;