const mongoose = require('mongoose');
const Vanthu_settingDx = new mongoose.Schema({
    _id: { type: Number },
    com_id: { type: Number },
    type_setting: { type: Number },
    type_browse: { type: Number },
    time_limit: { type: Number,
    default :0 },
    shift_id: { type: Number },
    time_limit_l: { type: String },
    list_user: { type: String },
    time_tp: { type: Number,
    default :0 },
    time_hh: { type: Number ,
        default :0},
    time_created: { type: Date },
    update_time: { type: Date, 
    default : "0000-00-00"},

});

module.exports = mongoose.model('Vanthu_Setting_Dx', Vanthu_settingDx);