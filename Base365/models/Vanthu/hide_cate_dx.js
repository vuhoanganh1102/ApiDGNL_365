const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hide_cate_dx = new Schema({
    id_hide : {
        type : Number,
        required : true
    },
    id_com : {
        type : Number,
        default : null
    },
    id_cate_dx : {
        type : String,
        default : null
    }
})
module.exports = mongoose.model("hide_cate_dx",hide_cate_dx)