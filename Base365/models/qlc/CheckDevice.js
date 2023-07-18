const mongoose = require('mongoose')
const CheckDevice = new mongoose.Schema({
    //Id bảng
    ed_id : {
        type : Number,
        required : true 
    },
    //Id người dùng
    idQLC: {
        type : Number
    },
    // // ID thiết bị hiện tại 
    current_device :{
        type : String
    },
    //tên thiết bị hiện tại
    current_device_name:{
        type : String,
        default : null
    },
    //ID thiết bị mới 
    new_device :{
        type : String,
        default : null
    },
    //tên thiết bị mới 
    new_device_name:{
        type : String,
        default : null
    },
    type_device :{
        type : Number,
        default : 0
    },
    //Thời điểm tạo 
    create_time: {
        type: Date,
        default: Date.now()
    },

})

module.exports = mongoose.model('QLC_Employee_device',CheckDevice)