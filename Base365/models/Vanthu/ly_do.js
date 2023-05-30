const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ly_do = new Schema({
    id_ld : {
        type : Number,
        required : true
    },
    type_ld : {
        type : Number,
    },
    nd_ld : {
        type : String,
    },
    id_dx : {
        type : Number
    },
    time_created : {
        type : Date
    }
})
module.exports = mongoose.model("ly_do",ly_do)