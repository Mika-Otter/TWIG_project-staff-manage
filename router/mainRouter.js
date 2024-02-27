const userRouter = require("express").Router();
const userModel = require("../public/assets/js/userModel");
const authguard = require("../services/authguard");
const bcrypt = require("bcrypt");

//Go to home__________________________________________
userRouter.get("/home", async (req, res) => {
    try {
        res.render("layouts/home.twig", {
            title: "Empleez",
        });
    } catch (error) {
        res.send(error);
    }
});

//Go to subscribe__________________________________________
userRouter.get("/subscribe", async (req, res) => {
    try {
        res.render("layouts/subscribe.twig", {
            title: "Empleez - Inscription",
        });
    } catch (error) {
        res.send(error);
    }
});

//Add user_________________________________________________
userRouter.post("/subscribe", async (req, res) => {
    try {
        const user = new userModel(req.body);
        await user.save();
        console.log("User Added");
        res.redirect("/home");
    } catch (error) {
        console.log("nooop");
        console.log(error);
        res.render("layouts/subscribe.twig", {
            error: error.errors,
            title: "Empleez S'inscrire",
        });
    }
});

//Login user_______________________________________________
userRouter.post("/home", async (req, res) => {
    console.log("ReqBody : ", req.body);
    try {
        console.log("test");
        let user = await userModel.findOne({ mail: req.body.mail });
        console.log(user);

        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user;
                console.log("yes");
                res.redirect("/dashboard");
            } else {
                throw { password: "Mauvais mot de passe" };
            }
        } else {
            throw { mail: "Cette adresse mail n'est pas enregistrée" };
        }
    } catch (error) {
        console.log(error);
        res.render("layouts/home.twig", {
            title: "Empleez - Error",
            error: error,
        });
    }
});

module.exports = userRouter;
