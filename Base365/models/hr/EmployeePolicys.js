const mongoose = require('mongoose');
const HR_EmployeePolicySchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    name: {
        type: String,
        required: true,
    },
    timeStart: {
        type: Date,
        required: true,
    },
    supervisorName	: {
        type: String,
        required: true,
    },
    description	: {
        type: String,
        required: true,
    },
    isDelete	: {
        type: Number,
        required: true,
    },
    comId	: {
        type: Number,
        required: true,
    },
    file	: {
        type: String,
        required: true,
    },
    createdAt	: {
        type: Date,
        required: true,
    },
    deletedAt	: {
        type: Date,
        required: true,
    },
}, {
    collection: 'HR_EmployeePolicys',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_EmployeePolicys", HR_EmployeePolicySchema);