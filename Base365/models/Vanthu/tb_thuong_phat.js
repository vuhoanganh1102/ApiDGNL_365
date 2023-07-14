const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Vanthu_tb_thuong_phat = new Schema({
    pay_id : {
        type : Number,
        require : true
    },
    pay_id_user :{
        type : Number,
        default : 0
    },
    pay_id_com :{
        type : Number,
        default : 0
    },
    pay_price :{
        type : Number,
        default : 0
    },
    pay_status :{
        type : Number,
        default : 0
    },
    pay_case :{
        type : Number,
        default : 0
    },
    pay_day :{
        type : Number,
        default : 0
    },
    pay_month :{
        type : Number,
        default : 0
    },
    pay_year :{
        type : Number,
        default : 0
    },
    pay_group :{
        type : Number,
        default : 0
    },
    pay_nghi_le :{
        type : Number
    },
    pay_time_created :{
        type : Date
    },


})
module.exports = mongoose.model("Vanthu_tb_thuong_phat",Vanthu_tb_thuong_phat)