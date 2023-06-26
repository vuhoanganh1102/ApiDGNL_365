//Model này dùng để kết nối với dịch vụ API tổng đài gọi điện thoại
const mongoose = require('mongoose')
//cài đặt hợp đồng 

const AccountAPISchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    com_id: { // id cty
        type: Number
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
    created_at: {
        type: Number

    },
    updated_at: {
        type: Number

    }
}, {
    collation: "AccountApi",
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('AccountApi', AccountAPISchema);