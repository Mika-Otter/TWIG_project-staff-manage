const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const userRouter = require("./router/mainRouter");
const employeeRouter = require("./router/mainRouter");
require("dotenv").config();

const app = express();

app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: "secret_key",
        resave: true,
        saveUninitialized: true,
    })
);
app.use(userRouter);
app.use(employeeRouter);

app.listen(parseInt(process.env.PORT), (err) => {
    if (!err) {
        console.log(`listen on ${process.env.PORT}`);
    } else {
        console.log(err);
    }
});

mongoose.connect(process.env.URL_DB);
