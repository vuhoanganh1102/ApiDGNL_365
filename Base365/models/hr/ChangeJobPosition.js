const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChangeJobPositionSchema = new Schema({
    //Id luân chuyển công tác
    _id: {
        type: Number,
        require: true
    },
    // Đơn vị công tác hiện tại
    workplaceCurrent: {
        type: String
    },
    // Đơn vị công tác mới
    workPlaceNew: {
        type: String
    },
    // Phòng hiện tại
    departmentCurrent: {
        type: String
    },
    // Phòng ban mới
    departmentNew: {
        type: String
    },
    // Tổ mới
    nestNew: {
        type: String
    },
    // Chức vụ mới
    positionNew: {
        type: String
    },
    timeWorkPlaceNew: {
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

module.exports = mongoose.model("HR_Appointments", ChangeJobPositionSchema);