const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const de_xuat_xu_ly = new Schema({
    id_dx: {
        type: Number,
        required : true
    },
    id_vb : {
        type : Number
    },
    user_xu_ly : {
        type : Number
    },
    y_kien_xu_ly : {
        type : String
    },
    ghi_chu : {
        type : String
    }
})
module.exports = mongoose.model("de_xuat_xu_ly", de_xuat_xu_ly);