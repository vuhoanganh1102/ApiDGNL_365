const mongoose = require('mongoose');
const ReportNewschema = new mongoose.Schema({
    _idReport:{
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
    createdAt:{
        type:Date,
        require:true
    }
});
module.exports = mongoose.model("ReportNews", ReportNewschema);