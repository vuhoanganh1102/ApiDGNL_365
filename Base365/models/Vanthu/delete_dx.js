const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const delete_dx = new Schema({
    id_del : {
        type : Number,
        required : true
    },
    user_del : {
        type : Number
    },
    user_del_com : {
        type : Number
    },
    id_dx_del : {
        type : Number
    },
    time_del : {
        type : Date
    }
})
module.exports = mongoose.model("delete_dx", delete_dx);