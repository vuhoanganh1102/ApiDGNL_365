const mongoose = require('mongoose');
const HR_DepartmentDetailSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    comId: {
        type: Number,
        required: true,
    },
    depId: {
        type: Number,
        required: true,
    },
    description	: {
        type: String,
    }
}, {
    collection: 'HR_DepartmentDetails',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("HR_DepartmentDetails", HR_DepartmentDetailSchema);