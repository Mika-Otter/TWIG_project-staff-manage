const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const { userRouter } = require("./router/userRouter");
const { employeeRouter } = require("./router/employeeRouter");
require("dotenv").config();

const app = express();

const helmet = require("helmet");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "cdn.jsdelivr.net",
        "fonts.googleapis.com",
      ],
      fontSrc: ["'self'", "cdn.jsdelivr.net", "fonts.gstatic.com"], // Ajoutez aussi fonts.gstatic.com pour les polices
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  })
);
app.use(express.static("./public"));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret_key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
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
