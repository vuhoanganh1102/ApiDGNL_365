const mongoose = require('mongoose')
const HisOfTracking = new mongoose.Schema({
    //id nhaan vieen
    _id: {
        type : Number,
        required : true
    },
    idQLC: {
        type : Number
    },
    imageTrack: {
        type: String,
        default: null
    },
    curDeviceName:{
        type : String
    },
    latitude: {
        // Tọa độ lat
        type: String,
        default: null
    },
    longtitude: {
        // Tọa độ long
        type: String,
        default: null
    },
    Location:{
        //vị trí
        type : String
    },
    NameWifi:{
        //tên wifi
        type : String
    },
    IpWifi:{
        //ip wifi
        type : String
    },
    MacWifi:{
        //mac wifi
        type : String
    },
    shiftID:{
        //id ca làm việc
        type : String
    },
    companyID:{
        //id công ty
        type : String
    },
    Note:{
        //note
        type : String
    },
    BluetoothAdrr:{
        //địa chỉ bluetooth
        type : String
    },
    role:{
        //vai trò
        type : Number
    // },
    // Err:{
    //     type : Boolean
    // },
    // Success:{
    //     type : Boolean
    // },
    }

}) 

module.exports = mongoose.model("HistoryOfTracking",HisOfTracking)