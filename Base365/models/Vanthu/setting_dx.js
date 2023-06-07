const mongoose = require('mongoose');
const Vanthu_settingDx = new mongoose.Schema({
    _id: {  // id setting de xuat
        type: Number 
    },
    com_id: { // id công ty
        type: Number 
    },
    type_setting: {  //1. Đề xuất có kế hoạch, 2.đề xuất đột xuất
        type: Number
     },
    type_browse: { // loại duyệt duyệt 1 nguoi, duyệt 2 nguoi
        type: Number
     },
    time_limit: { //thời gian duyệt đột xuất
        type: Number
     },
    shift_id: { //id thay đổi
        type: Number
     },
    time_limit_l: { 
        type: String
     },
    list_user: { 
        type: String
     },
    time_tp: { //thời gian duyệt đề xuất thưởng phạt
        type: Number
     },
    time_hh: { //thời gian duyệt đề xuất hoa hồng doanh thu
        type: Number
     },
    time_created: { //thời gian tạo cài đặt
        type: Date,
     },
    update_time: { //thời gian sửa cải đặt
        type: Date,
        default : 0
     },

});

module.exports = mongoose.model('Vanthu_Setting_Dx', Vanthu_settingDx);