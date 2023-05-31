const mongoose = require('mongoose')
const HisOfTracking = new mongoose.Schema({
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
        type : String
    },
    NameWifi:{
        type : String
    },
    IpWifi:{
        type : String
    },
    MacWifi:{
        type : String
    },
    shiftID:{
        type : String
    },
    companyId:{
        type : String
    },
    Note:{
        type : String
    },
    BluetoothAdrr:{
        type : String
    },
    role:{
        type : Number
    },
    Err:{
        type : Boolean
    },
    Success:{
        type : Boolean
    },
    

}) 