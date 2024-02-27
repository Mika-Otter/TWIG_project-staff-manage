const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
        validate: {
            validator: (v) => {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/u.test(v);
            },
            message: "Entrez un nom valide",
        },
    },
    firstName: {
        type: String,
        required: [true, "Le prénom est requis"],
        validate: {
            validator: (v) => {
                return /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]+$/u.test(v);
            },
            message: "Entrez un prénom valide",
        },
    },
    email: {
        type: String,
        required: [true, "L'email est requis"],
        validate: {
            validator: (v) => {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
            },
            message: "Votre email n'est pas valide, avez-vous fait une erreur ?",
        },
    },
    password: {
        type: String,
        required: [true, "Le mot de passe est requis"],
        validate: {
            validator: (v) => {
                return /^[a-zA-Z0-9!?.\-_éà]{7,}$/u.test(v);
            },
        },
    },
    confirmPassword: {
        type: String,
        required: [true, "Veuillez entrer le mot de passe à l'identique"],
        validate: {
            validator: (v) => {
                return v === this.password;
            },
            message: "Les mots de passe ne sont pas identiques.",
        },
    },
});

userSchema.pre("validate", async (next) => {
    try {
        const existingUser = await this.constructor.findOne({ email: this.email });
        if (existingUser) {
            this.invalidate("email", "Cet email est déjà enregistré."); //génère une erreur de validation
        }
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre("save", (next) => {
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

const userModel = mongoose.model("Users", userSchema);
module.exports = userModel;
