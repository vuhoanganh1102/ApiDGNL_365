const mongoose = require('mongoose');
const Schema = mongoose.Schema
    // model lưu data của nhà tuyển dụng khi đăng ký sai cho marketing
const userCompanyUnset = new mongoose.Schema({
    _id: {
        type: Number,
    },
    email: {
        // mail của nhà tuyển dụng
        type: String,
        default: null
    },
    phone: {
        // phone của nhà tuyển dụng
        type: String,
        default: null

    },
    nameCompany: {
        // tên của nhà tuyển dụng
        type: String,
        default: null

    },

    city: {
        // id thành phố
        type: Number,
        default: null

    },
    district: {
        // id quận/ huyện nhà tuyển dụng
        type: Number,
        default: null

    },
    address: {
        // chi tiết địa chỉ
        type: String,
        default: null

    },
    errTime: {
        // thời gian lỗi
        type: Date,
        default: null

    },
    regis: {
        // được gửi từ đâu web 0,app 1
        type: Number,
        default: 0

    }
})
module.exports = mongoose.model("UserCompanyUnset", userCompanyUnset);