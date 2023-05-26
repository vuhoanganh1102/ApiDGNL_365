//model này quản lý đọc, thêm, sửa, xoá các trạng thái của khách hàng
const mongoose = require('mongoose')

const StatusCustomerSchema = new mongoose.Schema({
    _id: {
        //id phân loại tình trạng khách hàng
        type: Number,
        required: true
    },
    customerStatusName: {
        //tên cho tình trạng khách hàng
        type: String,
        required: true
    },
    createdUserId: {
        //id người tạo
        type: String,
        required: true
    },
    type_created: {
        // kiểu người tạo (tk công ty hay nhân viên)
        type: Number,
        required: true
    },
    status: {
        //trạng thái có đang sử dụng hay không
        type: Boolean,
        required: true,
        default: 0
    },
    isDelete: {
        //trạng thái của "tình trạng khách hàng" đã bị xoá hay chưa
        type: Boolean,
        required: true,
        default: false
    },

}, {
    collection: 'StatusCustomer',
    versionKey: false,
    timestamp: true
});
exports.model = mongoose.model("StatusCustomer", StatusCustomerSchema)