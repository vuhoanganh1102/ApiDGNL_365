//Model này dùng để kết nối với dịch vụ API tổng đài gọi điện thoại
const mongoose = require('mongoose')


const AccountAPISchema = new mongoose.Schema({
    _id: {
        //id công ty
        type: Number,
        required: true
    },
    account: {
        //tên đăng nhập tài khoản dịch vụ
        type: String,
        required: true
    },
    password: {
        //mật khẩu đăng nhập tài khoản dịch vụ
        type: String,
        required: true
    },
    switchboard: {
        //tổng đài dịch vụ
        type: String,
        required: true
    },
    domain: {
        //miền
        type: String,
        required: true
    },
    status: {
        //trạng thái account
        type: Number,
        required: true,
        default: 1
    },
}, {
    collation: "AccountApi",
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('AccountApi', AccountAPISchema);