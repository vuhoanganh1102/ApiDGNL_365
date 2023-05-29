const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
    //Id bổ nhiệm, quy hoạch
    _id: {
        type: Number,
        require: true
    },
    // Chức vụ hiện tại
    positionCurrent: {
        type: String
    },
    // Phòng hiện tại
    departmentCurrent: {
        type: String
    },
    // Quy hoạch bổ nhiệm chức vụ mới
    positionNew: {
        type: String,
    },
    // Phòng ban mới
    departmentNew: {
        type: String
    },
    // Tên quy định áp dụng
    nameProvision: {
        type: String
    },
    // Lý do bổ nhiệm
    reason: {
        type: String
    },
    // Ngày tạo bổ nhiệm, quy hoạch
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // Ngày xoá chính sách nhân viên
    deleteAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Appointments", AppointmentSchema);