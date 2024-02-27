const userRouter = require("express").Router();

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

module.exports = userRouter;

// module.exports = Subscribe;

// const Subscribe = async (req, res) => {
//     try {
//         const user = new userModel(req.body);
//         await user.save();
//         res.redirect("/login");
//     } catch (error) {
//         res.render("layouts/subscribe.twig", {
//             error: error.errors,
//             title: "Empleez S'inscrire",
//         });
//     }
// };

// userRouter.get("/subscribe", Subscribe);
