const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const message = new Schema({
    id_mes : {
        type : Number
    },
    id_user_sent : {
        type : Number
    },
    id_user_nhan : {
        type : Number
    },
    text_mes : {
        type : String
    },
    image_mes : {
        type : String
    }
})
module.exports = mongoose.model("message",message)