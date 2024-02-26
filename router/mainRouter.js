const useRouter = require("express").Router();

useRouter.get("/", async (req, res) => {
    try {
        res.render("layouts/home.twig", {
            title: "Empleez",
        });
    } catch (error) {
        res.send(error);
    }
});

module.exports = useRouter;
