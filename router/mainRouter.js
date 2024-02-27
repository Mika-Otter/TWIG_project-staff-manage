const userRouter = require("express").Router();
const userModel = require("../public/assets/models/userModel");
const employeeModel = require("../public/assets/models/employeeModel");
const employeeRouter = require("express").Router();
const authguard = require("../services/authguard");
const bcrypt = require("bcrypt");

//Go to home__________________________________________
userRouter.get("/home", async (req, res) => {
    try {
        res.render("pages/home.twig", {
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
        res.render("pages/home.twig", {
            title: "Empleez - Error",
            error: error,
        });
    }
});

//Go to dashboard session________________________________________________
userRouter.get("/dashboard", authguard, async (req, res) => {
    res.render("pages/dashboard.twig", {
        user: await userModel.findById(req.session.user._id),
        title: `Dashboard - ${req.session.user.name}`,
    });
});

//Employe Adding_________________________________________________________
employeeRouter.get("/addEmployee", authguard, async (req, res) => {
    res.render("layouts/addEmployee.twig", {
        title: "Empleez - Ajouter un-e employé-e",
        user: await userModel.findById(req.session.user._id),
    });
});

module.exports = userRouter;
module.exports = employeeRouter;
