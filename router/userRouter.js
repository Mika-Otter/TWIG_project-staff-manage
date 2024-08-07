const userRouter = require("express").Router();
const userModel = require("../public/assets/models/userModel");
const authguard = require("../services/authguard");
const bcrypt = require("bcrypt");

//Dashboard display_________________________________________________
userRouter.get("/dashboard", authguard, async (req, res) => {
  try {
    const userWithEmployees = await userModel
      .findById(req.session.user._id)
      .populate("employeeList");
    res.render("pages/dashboard.twig", {
      user: userWithEmployees,
      title: "Empleez - Dashboard",
    });
  } catch (error) {
    console.log(error);
    res.render("pages/dashboard.twig", {
      title: "Empleez - Error",
      error: error,
    });
  }
});

//Login user_________________________________________________________
userRouter.post("/home", async (req, res) => {
  console.log("ReqBody : ", req.body);
  try {
    let user = await userModel.findOne({ email: req.body.email });
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

//Add user__________________________________________________________
userRouter.post("/subscribe", async (req, res) => {
  try {
    const user = new userModel(req.body);
    console.log(req.body);
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
      title: "Dashboard - Filter Name",
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
      title: "Dashboard - Filter Position",
    });
  } catch (error) {
    console.error(error);
    res.redirect("/dashboard");
  }
});

module.exports = { userRouter };

// END ===============================================================
