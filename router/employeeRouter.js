const employeeRouter = require("express").Router();
const userModel = require("../public/assets/models/userModel");
const employeeModel = require("../public/assets/models/employeeModel");
const authguard = require("../services/authguard");
const bcrypt = require("bcrypt");

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

module.exports = { employeeRouter };

// END ===============================================================

// employeeRouter.get("/test", async (req, res) => {
//     res.render("layouts/addEmployee.twig", {
//         title: "Empleez - Ajouter un-e employé-e",
//     });
// });
