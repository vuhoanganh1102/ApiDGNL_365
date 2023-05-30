const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Vanthu_setting = new Schema({
    id_setting: {
        type: Number
    },
    id_user : {
        type: Number
    },
    type_tb : {
        type : Number
    },
    type_nhac_nho : {
        type : Number
    },
    time_duyet_setting : {
        type : Date
    }
})

module.exports = mongoose.model("Vanthu_setting", Vanthu_setting)