const mongoose = require('mongoose');
const Schema = mongoose.Schema
// model lưu data của nhà tuyển dụng khi đăng ký sai cho marketing
const userCompanyUnset = new mongoose.Schema(
    {
        _id:{
            type: Number,
        },
        email:{
            // mail của nhà tuyển dụng
            type: String,
        },
        phone: {
            // mail của nhà tuyển dụng
            type: String,
        },
        nameCompany: {
            // mail của nhà tuyển dụng
            type: String,
        },
        // mail của nhà tuyển dụng
        city:Number,
        // id thành phố của nhà tuyển dụng
        district:Number,
        // id quận/ huyện nhà tuyển dụng
        address:String,
        // mail địa chỉ
        errTime:Date,
        // được gửi từ đâu web 0,app 1
        regis:Number
    })
    module.exports = mongoose.model("UserCompanyUnset", userCompanyUnset);
