const userRouter = require("express").Router();
const userModel = require("../public/assets/models/userModel");
const employeeModel = require("../public/assets/models/employeeModel");
const employeeRouter = require("express").Router();
const authguard = require("../services/authguard");
const bcrypt = require("bcrypt");

//Go to home_______________________________________________________
userRouter.get("/home", async (req, res) => {
    try {
        res.render("pages/home.twig", {
            title: "Empleez",
        });
    } catch (error) {
        res.send(error);
    }
});

//Go to subscribe___________________________________________________
userRouter.get("/subscribe", async (req, res) => {
    try {
        res.render("layouts/subscribe.twig", {
            title: "Empleez - Inscription",
        });
    } catch (error) {
        res.send(error);
    }
});

//Add user__________________________________________________________
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

//Login user_________________________________________________________
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

//Employe Adding______________________________________________________
employeeRouter.get("/addEmployee", authguard, async (req, res) => {
    res.render("layouts/addEmployee.twig", {
        title: "Empleez - Ajouter un-e employé-e",
        user: await userModel.findById(req.session.user._id),
    });
});

employeeRouter.post("/addEmployee", authguard, async (req, res) => {
    try {
        let employee = new employeeModel(req.body);
        employee._user = req.session.user._id;
        await employee.save();
        console.log("Employee Added");
        res.redirect("/dashboard");
    } catch (error) {
        console.log(error);
        res.render("layouts/addEmployee.twig", {
            title: "Empleez - Ajouter un-e employé-e",
            user: await userModel.findById(req.session.user._id),
            error: error,
        });
    }
});

//Dashboard display_________________________________________________
userRouter.get("/dashboard", authguard, async (req, res) => {
    try {
        const userWithEmployees = await userModel
            .findById(req.session.user._id)
            .populate("employeeList");
        console.log(userWithEmployees);
        res.render("pages/dashboard.twig", {
            user: userWithEmployees,
            title: "Empleez - Dashboard.twig",
        });
    } catch (error) {
        console.log(error);
        res.render("pages/dashboard.twig", {
            title: "Empleez - Error",
            error: error,
        });
    }
});

// Delete Employee__________________________________________________

employeeRouter.get("/deleteEmployee/:employeeid", authguard, async (req, res) => {
    try {
        await employeeModel.deleteOne({ _id: req.params.employeeid });
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.render("pages/dashboard.twig", {
            errorDelete: "Un problème est survenu pendant la suppression",
            user: await userModel.findById(req.session.user._id).populate("employeeList"),
            title: "Empleez - Dashboard",
        });
    }
});

// Modify Employee__________________________________________________
employeeRouter.get("/modifyEmployee/:employeeid", authguard, async (req, res) => {
    try {
        let employee = await employeeModel.findById(req.params.employeeid);
        console.log(employee);
        res.render("layouts/addEmployee.twig", {
            title: "Empleez - Modifier un employé",
            user: await userModel.findById(req.session.user._id),
            employee: employee,
        });
        console.log("hello");
    } catch (error) {
        console.error(error);
        res.render("pages/dashboard.twig", {
            errorMessage: "L'employé que vous souhaitez modifier n'existe pas",
            user: await userModel.findById(req.session.user._id),
            title: "Empleez - Dashboard",
        });
    }
});

module.exports = { userRouter, employeeRouter };

// END ===============================================================

// employeeRouter.get("/test", async (req, res) => {
//     res.render("layouts/addEmployee.twig", {
//         title: "Empleez - Ajouter un-e employé-e",
//     });
// });
