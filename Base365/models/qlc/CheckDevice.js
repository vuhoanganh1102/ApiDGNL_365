const mongoose = require('mongoose')
const CheckDevice = new mongoose.Schema({
    //Id bảng
    _id : {
        type : Number,
        required : true 
    },
    //Id người dùng
    userId: {
        type : Number
    },
    //Id của công ty
    companyId: {
        type: Number
    },
    //Id phòng ban 
    depID: {
        type : Number
    },
    // // ID thiết bị hiện tại 
    // curDeviceId :{
    //     type : Number
    // },
    //tên thiết bị hiện tại
    curDeviceName:{
        type : String
    },
    // //ID thiết bị mới 
    // newDeviceId :{
    //     type : Number
    // },
    //tên thiết bị mới 
    newDeviceName:{
        type : String
    },
    //Thời điểm tạo điểm danh
    createdAt: {
        type: Date,
        default: Date.now()
    },

})

module.exports = mongoose.model('CheckDevice',CheckDevice)