const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Vanthu_setting_dx = new Schema({
    id_setting: {
        type: Number
    },
    com_id: {
        type: Number
    },
    type_setting : {
        type : Number
    },
    type_browse : {
        type : Number
    },
    time_limit : {
        type : Date
    },
    shift_id : {
        type : Number
    },
    time_limit_l : {
        type : String
    },
    list_user : {
        type : String
    },
    time_tp : {
        type : Date
    },
    time_hh : {
        type : Date
    },
    time_created : {
        type : Date
    },
    update_time : {
        type : Date
    }
})

module.exports = mongoose.model("Vanthu_setting_dx", Vanthu_setting_dx)