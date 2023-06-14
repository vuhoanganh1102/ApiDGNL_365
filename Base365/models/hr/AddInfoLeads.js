const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddInfoLeadSchema = new Schema({
    //Id 
    _id: {
        type: Number,
        require: true
    },
    // Id nhân viên
    epId: {
        type: Number,
        require: true
    },
   
    nameDes: {
        type: String,
        require: true
    },
    // Mô tả
    description: {
        type: String,
        require: true
    },
    // Ngày tạo
    created_at: {
        type: Date,
        require: true
    },
    // ngày update
    updated_at: {
        type: Date,
        require: true
    }
}, {
    collection: 'HR_AddInfoLead',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_AddInfoLead", AddInfoLeadSchema);