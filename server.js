const express = require("express");
const mongoose = require("mongoose");
const useRouter = require("./router/mainRouter");
require("dotenv").config();

const app = express();

app.use(express.static("./public"));
app.use(useRouter);

app.listen(parseInt(process.env.PORT), (err) => {
    if (!err) {
        console.log(`listen on ${process.env.PORT}`);
    } else {
        console.log(err);
    }
});

mongoose.connect("mongodb://localhost:27017");
