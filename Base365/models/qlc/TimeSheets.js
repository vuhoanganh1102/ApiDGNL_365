const mongoose = require('mongoose')
const CC365_TimeSheet = new mongoose.Schema({
    sheet_id: {
        type: Number,
        required: true,
        unique: true
    },
    ep_id: {
        type: Number
    },
    ts_image: {
        type: String,
        default: null
    },
    at_time: {
        //thời điểm chấm công 
        type: Date,
        default: Date.now()
    },
    device: {
        type: String,
        default: null
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
        type: String,
        default: null
    },

    wifi_name: {
        //tên wifi
        type: String
    },
    wifi_ip: {
        //ip wifi
        type: String,
        default: null
    },
    wifi_mac: {
        //mac wifi
        type: String,
        default: null
    },
    shift_id: {
        //id ca làm việc
        type: Number,
        default: 0
    },
    ts_com_id: {
        //id công ty
        type: Number,
        default: 0
    },
    note: {
        //note
        type: String,
        default: null
    },
    bluetooth_address: {
        //địa chỉ bluetooth
        type: String,
        default: null
    },
    status: {
        //trạng thái của công: 1 là công chấm mặt, 2 là công chấm QR, 3 là bù công',
        type: Number,
        default: 1
    },
    ts_error: {
        type: String,
        default: null
    },
    is_success: { //trạng thái Thành công
        type: Number,
        default: 1
    }
}, {
    collection: 'CC365_TimeSheet',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("CC365_TimeSheet", CC365_TimeSheet)