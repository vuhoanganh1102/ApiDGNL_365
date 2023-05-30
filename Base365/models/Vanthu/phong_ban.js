const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const phong_ban = new Schema({
    id_phong_ban : {
        type : Number
    },
    ten_phong_ban :{
        type : String
    },
    thanh_vien :{
        type : Number
    },
    create_date_phongban :{
        type : Date
    }

})
module.exports = mongoose.model("phong_ban",phong_ban)