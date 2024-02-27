const mongoose = require("mongoose");
const userModel = require("./userModel");

const employeeSchema = mongoose.Schema({
    employeeName: {
        type: String,
        required: [true, "Le nom est requis"],
    },
    employeeFirstName: {
        type: String,
        required: [true, "Le prénom est requis"],
    },
    employeePosition: {
        type: String,
        required: [true, "Le poste est requis"],
    },
    employeeSalary: {
        type: String,
    },
    employeeStatu: {
        type: String,
    },
});

employeeSchema.pre("save", async function (next) {
    try {
        await userModel.updateOne({ _id: this._user }, { $addToSet: { employeeList: this._id } });
        console.log(this._user.employeeList);
        console.log("It's save !");
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

const employeeModel = mongoose.model("employee", employeeSchema);

module.exports = employeeModel;
