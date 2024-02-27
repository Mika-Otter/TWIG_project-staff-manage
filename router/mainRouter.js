const userRouter = require("express").Router();
const userModel = require("../public/assets/js/userModel");

userRouter.get("/home", async (req, res) => {
    try {
        res.render("layouts/home.twig", {
            title: "Empleez",
        });
    } catch (error) {
        res.send(error);
    }
});

userRouter.get("/subscribe", async (req, res) => {
    try {
        res.render("layouts/subscribe.twig", {
            title: "Empleez - Inscription",
        });
    } catch (error) {
        res.send(error);
    }
});

userRouter.post("/subscribe", async (req, res) => {
    try {
        const user = new userModel(req.body);
        await user.save();
        console.log("User Added");
        res.redirect("/home");
    } catch (error) {
        console.log("nooop");
        console.log(error.errors);
        res.render("layouts/subscribe.twig", {
            error: error.errors,
            title: "Empleez S'inscrire",
        });
    }
});

module.exports = userRouter;
