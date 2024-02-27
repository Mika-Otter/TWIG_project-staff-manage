const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Le nom est requis"],
    },
    firstname: {
        type: String,
        required: [true, "Le prénom est requis"],
    },
    position: {
        type: String,
        required: [true, "Le poste est requis"],
    },
    salary: {
        type: Number,
    },
    modality: {
        type: String,
    },
});

const employeeModel = mongoose.model("employee", employeeSchema);

module.exports = employeeModel;
