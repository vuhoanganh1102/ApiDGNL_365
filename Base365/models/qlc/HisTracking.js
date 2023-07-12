const mongoose = require('mongoose')
const HisOfTracking = new mongoose.Schema({
    //id nhaan vieen
    sheet_id: {
        type: Number,
        required: true
    },
    idQLC: {
        type: Number
    },
    ts_image: {
        type: String,
        default: null
    },
    device: {
        type: String
    },
    ts_lat: {
        // Tọa độ lat
        type: String,
        default: null
    },
    ts_long: {
        // Tọa độ long
        type: String,
        default: null
    },
    ts_location_name: {
        //vị trí
        type: String
    },
    at_time: {
        //thời điểm chấm công 
        type: Date,
        default: Date.now()
    },
    wifi_name: {
        //tên wifi
        type: String
    },
    wifi_ip: {
        //ip wifi
        type: String
    },
    wifi_mac: {
        //mac wifi
        type: String
    },
    shift_id: {
        //id ca làm việc
        type: Number
    },
    com_id: {
        //id công ty
        type: Number,
        default : 0

    },
    note: {
        //note
        type: String
    },
    bluetooth_address: {
        //địa chỉ bluetooth
        type: String
    },
  
    status: {
        //trạng thái của công: 1 là công chấm mặt, 2 là công chấm QR, 3 là bù công',
        type: Number,
        default : 1
    },
    ts_error: { //trạng thái thất bại
        type: String,
    },
    is_success: { //trạng thái Thành công
        type: String,
        default : 1

    },


}, {
    collection: 'QLC_Time_sheets',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("QLC_Time_sheets", HisOfTracking)