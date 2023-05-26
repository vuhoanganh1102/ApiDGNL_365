//model dùng để quản lý đọc, thêm, sửa, xoá "nhóm khác hàng"
const mongoose = require('mongoose');
const User = require('../Users')

const CustomerGroupSchema = new mongoose.Schema({
    _id: {
        //mã phân loại nhóm
        type: Number,
        require: true
    },
    groupName: {
        //têm nhóm
        type: String,
        required: true
    },
    groupDescription: {
        //mô tả nhóm khách hàng
        type: String
    },
    groupParent: {
        //tên nhóm khách hàng cha
        type: Number,
        default: 0
    },
    companyId: {
        //id công ty
        type: Number,
        default: 0
    },
    departmentId: {
        //id phòng ban chia sẻ, nếu chọn tất cả truyền vào "all"
        type: String
    },
    employeeShare: {
        //danh sách nhân viên được chia sẻ
        type: [{
            employeeId: { //id nhân viên được chia sẻ
                type: Number
            },
            employeeName: {
                type: String //Tên nhân viên được chia sẻ
            }
        }],
        default: []
    },
    countCustomer: {
        //số lượng khác hàng thuộc nhóm
        type: Number,
        required: true
    },
    isDelete: {
        //trạng thái đã xoá hay chưa
        type: Boolean,
        required: true,
        default: false
    },

}, {
    collection: 'GroupCustomer',
    versionKey: false,
    timestamp: true
});


module.exports = mongoose.model('GroupCustomer', CustomerGroupSchema);