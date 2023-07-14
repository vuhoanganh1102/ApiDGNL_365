const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_tb_rose = new Schema({
    ro_id : {
        type : Number,
        require : true
    },
    ro_id_user :{
        type : Number,
        default : 0
    },
    ro_id_group :{
        type : Number,
        default : 0
    },
    ro_id_com :{
        type : Number,
        default : 0
    },
    ro_id_lr :{
        type : Number,
        default : 0
    },
    ro_id_tl :{
        type : Number,
        default : 0
    },
    ro_so_luong :{
        type : Number,
        default : 0
    },
    ro_time :{
        type : Date
    },
    ro_time_end :{
        type : Date
    },
    ro_note :{
        type : String,
        default : ""
    },
    ro_price :{
        type : Number,
        default : 0
    },
    ro_kpi_active :{
        type : Number,
        default : 0
    },
    ro_time_created :{
        type : Number
    },


})
module.exports = mongoose.model("Vanthu_tb_rose",Vanthu_tb_rose)