const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PermisionDetailSchema = new Schema({
    // id tu dong tang
    _id: {
        type: Number,
        require: true
    },
    // id quyen
    perId: {
        type: Number,
        require: true
    },
    // ten hanh dong
    actName: {
        type: String,
        default: null 
    },
    // ma hanh dong
    actCode: {
        type: String,
        default: null 
    },
    //check action
    checkAct: {
        type: Number,
        default: 0
    }
},{
    collection: 'HR_PermisionDetails',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_PermisionDetails",PermisionDetailSchema);
