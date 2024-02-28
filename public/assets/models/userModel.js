const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/u.test(v);
            },
            message: "Entrez un nom valide",
        },
    },
    SiretNum: {
        type: String,
        required: [true, "Le numéro SIRET est requis."],
        validate: {
            validator: function (v) {
                return /^[0-9]{14}$/.test(v);
            },
            message: "Entrez un numéro SIRET valide à 14 chiffres sans espaces.",
        },
    },
    directorName: {
        type: String,
        required: [true, "Le nom du directeur est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/u.test(v);
            },
            message: "Entrez un nom valide",
        },
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: "Votre email n'est pas valide, avez-vous fait une erreur ?",
        },
    },

    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9!?.\-_éà]{7,}$/u.test(v);
            },
            message:
                'Le mot de passe doit contenir au moins 7 caractères. \n Autorisé : ajuscules, minuscules, chiffres et caractères spéciaux "! ? . - _ é à"',
        },
    },
    confirmPassword: {
        type: String,
        required: [true, "Veuillez entrer le mot de passe à l'identique"],
        validate: {
            validator: function (v) {
                return v === this.password;
            },
            message: "Les mots de passe ne sont pas identiques.",
        },
    },
    employeeList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "employee",
        },
    ],
});

userSchema.pre("validate", async function (next) {
    try {
        const existingUser = await this.constructor.findOne({ email: this.email });
        if (existingUser) {
            this.invalidate("email", "eCet email est déjà enregistré.");
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    bcrypt.hash(this.password, 10, (error, hash) => {
        if (error) {
            return next(error);
        }
        this.password = hash;
        next();
    });
});

userSchema.pre("save", function (next) {
    if (!this.isModified("confirmPassword")) {
        return next();
    }

    bcrypt.hash(this.confirmPassword, 10, (error, hash) => {
        if (error) {
            return next(error);
        }
        this.confirmPassword = hash;
        next();
    });
});

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
