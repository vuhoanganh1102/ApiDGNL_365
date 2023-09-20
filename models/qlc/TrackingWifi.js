const mongoose = require('mongoose')
const Schema = mongoose.Schema;
//lấy danh sách vị trí công ty chấm công bằng QR
const TrackingWifi = new Schema({
    //ID của chấm công QR
    wifi_id: {
        type: Number,
        required: true
    },
    //id công ty
    com_id: {
        type : Number,
    },
    name_wifi:{
        // tên wifi
        type : String
    },
    create_time:{
        //thời điểm tạo 
        type : Date,
        default : Date.now()
    },
    ip_address: {
        type: String
    },
    mac_address: {
        type: String
    },
    is_default: {
        type: Number,
    },
    status : {
        type: Number
    },
})

module.exports = mongoose.model('QLC_Company_wifi', TrackingWifi)
