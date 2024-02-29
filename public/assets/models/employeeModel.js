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
    employeeBlame: {
        type: Number,
    },
    employeeImg: {
        type: String,
        default: "token.png",
    },
});

employeeSchema.pre("save", async function (next) {
    try {
        await userModel.updateOne({ _id: this._user }, { $addToSet: { employeeList: this._id } });
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

employeeSchema.post("deleteOne", async function (next) {
    const deleteEmployeeId = this.getQuery()._id;
    await userModel.updateOne(
        { employeeList: { $in: [deleteEmployeeId] } },
        { $pull: { employeeList: deleteEmployeeId } }
    );

    next();
});

const employeeModel = mongoose.model("employee", employeeSchema);

module.exports = employeeModel;
