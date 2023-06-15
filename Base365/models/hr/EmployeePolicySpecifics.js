const mongoose = require('mongoose');
const HR_EmployeePolicySpecificSchema = new mongoose.Schema({
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
    employeePolicyId: {
        type: Number,
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
    content	: {
        type: String,
        required: true,
    },
    isDelete	: {
        type: Number,
        required: true,
        default:0   
    },
    createdBy	: {
        type: String,
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
    updatedAt	: {
        type: Date,
        required: true,
    },
    deletedAt	: {
        type: Date,
        required: true,
    },
}, {
    collection: 'HR_EmployeePolicySpecifics',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_EmployeePolicySpecifics", HR_EmployeePolicySpecificSchema);