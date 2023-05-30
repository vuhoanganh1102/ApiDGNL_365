const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const history_handling_dx = new  Schema({
    id_his : {
        type : Number,
        required : true
    },
    id_dx: {
        type : Number,
        default : null
    },
    id_user : {
        type : Number,
        default : null
    },
    type_handling : {
        type : Number
    },
    time :{
        type : Date
    }

})
module.exports = mongoose.model("history_handling_dx",history_handling_dx)