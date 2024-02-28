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
        let user = await userModel.findOne({ mail: req.body.mail });
        if (user) {
            if (await bcrypt.compare(req.body.password, user.password)) {
                req.session.user = user;
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

// Disconnect user____________________________________________________
userRouter.get("/disconnect", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.redirect("/dashboard");
        } else {
            res.redirect("/home");
        }
    });
});

//Employee Adding______________________________________________________
employeeRouter.get("/addEmployee", authguard, async (req, res) => {
    res.render("layouts/addEmployee.twig", {
        title: "Empleez - Ajouter un-e employé-e",
        user: await userModel.findById(req.session.user._id).populate("employeeList"),
    });
});

employeeRouter.post("/addEmployee", authguard, async (req, res) => {
    try {
        let employee = new employeeModel(req.body);
        employee._user = req.session.user._id;
        await employee.save();
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
        // console.log(userWithEmployees);
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

// Sort by Name AZ________________________________________________

userRouter.get("/dashboard/filterName", authguard, async (req, res) => {
    try {
        const userWithEmployees = await userModel
            .findById(req.session.user._id)
            .populate("employeeList");

        userWithEmployees.employeeList.sort((a, b) => {
            const nameA = a.employeeName;
            const nameB = b.employeeName;
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }
            return 0;
        });
        res.render("pages/dashboard.twig", {
            user: userWithEmployees,
            title: "Empleez - Dashboard Filter",
        });
    } catch (error) {
        console.error(error);
        res.redirect("/dashboard");
    }
});

// Sort by position AZ______________________________________________

userRouter.get("/dashboard/filterPosition", async (req, res) => {
    try {
        const userWithEmployees = await userModel
            .findById(req.session.user._id)
            .populate("employeeList");

        userWithEmployees.employeeList.sort((a, b) => {
            const posA = a.employeePosition.toUpperCase();
            const posB = b.employeePosition.toUpperCase();

            if (posA < posB) {
                return -1;
            }
            if (posA > posB) {
                return 1;
            }
            return 0;
        });
        res.render("pages/dashboard.twig", {
            user: userWithEmployees,
            title: "Empleez - Dashboard Filter",
        });
    } catch (error) {
        console.error(error);
        res.redirect("/dashboard");
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
        let user = await userModel.findById(req.session.user._id).populate({
            path: "employeeList",
            match: { _id: { $ne: req.params.employeeid } },
        });
        res.render("layouts/addEmployee.twig", {
            title: "Empleez - Modifier un employé",
            user: user,
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

employeeRouter.post("/updateEmployee/:employeeid", authguard, async (req, res) => {
    try {
        await employeeModel.findOneAndUpdate(
            { _id: req.params.employeeid },
            { $set: req.body },
            { new: true }
        );
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.redirect("/dashboard");
    }
});

// Add Blame___________________________________________________________
employeeRouter.get("/addBlame/:employeeid", authguard, async (req, res) => {
    try {
        console.log("hello");
        let employee = await employeeModel.findByIdAndUpdate(
            req.params.employeeid,
            { $inc: { employeeBlame: 1 } },
            { new: true }
        );
        if (employee.employeeBlame === 3) {
            res.redirect(`/deleteEmployee/${req.params.employeeid}`);
        }

        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.render("pages/dashboard.twig", {
            errorMessage: "Une erreur dans l'ajout de blame a été détectée.",
            user: await userModel.findById(req.session.user._id),
            title: "Empleez - Dashboard",
        });
    }
});

// Decrease Blame___________________________________________________________
employeeRouter.get("/decreaseBlame/:employeeid", authguard, async (req, res) => {
    try {
        console.log("hello");
        await employeeModel.findByIdAndUpdate(
            req.params.employeeid,
            { $inc: { employeeBlame: -1 } },
            { new: true }
        );
        let employee = await employeeModel.findById(req.params.employeeid);
        res.render("layouts/addEmployee.twig", {
            title: "Empleez - Modifier un employé",
            user: await userModel.findById(req.session.user._id),
            employee: employee,
        });
    } catch (error) {
        console.error(error);
        res.render("pages/dashboard.twig", {
            errorMessage: "Une erreur dans l'ajout de blame a été détectée.",
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
