const mongoose = require('mongoose');
const ReportNewschema = new mongoose.Schema({
    _id:{
        type:Number,
        require:true
    },
    id_user:{
        type:Number,
        require:true
    },
    id_new:{
        type:Number,
        require:true
    },
    problem:{
        type: String,
        require:true
    },
    reportDetail:{
        type: String,
        require:true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    }
});
module.exports = mongoose.model("ReportNews", ReportNewschema);