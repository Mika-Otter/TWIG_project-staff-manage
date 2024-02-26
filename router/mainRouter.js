const useRouter = require("express").Router();

useRouter.get("/", async (req, res) => {
    try {
        res.render("base.twig", {
            title: "Empleez",
        });
    } catch (error) {
        res.send(error);
    }
});

module.exports = useRouter;
