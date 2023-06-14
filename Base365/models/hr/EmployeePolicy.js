const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeePolicySchema = new Schema({
    //Id chính sách nhân viên
    _id: {
        type: Number,
        require: true
    },
    // Tên nhóm chính sách
    name: {
        type: String,
    },
    //Thời gian bắt đầu
    timeStart: {
        type: String,
    },
    //Tên người giám sát
    nameSupervisor: {
        type: String,
    },
    // Mô tả chính sách
    description: {
        type: String,
    },
    // Lưu thông tin xoá chính sách người dùng
    isDelete: {
        type: Boolean,
        default: false
    },
    // Id công ty tạo chính sách
    companyId: {
        type: Number
    },
    // Tên file đính kèm
    file: {
        type: String
    },
    // Ngày tạo chính sách nhân viên
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // Ngày xoá chính sách nhân viên
    deleteAt: {
        type: Date,
        default: Date.now()
    },
    // Chính sách cụ thể
    employeePolicySpecifics: {
        type: [{
            // Id chính sách cụ thể
            _id: {
                type: Number,
                require: true
            },
            // Tên chính sách cụ thể
            name: {
                type: String
            },
            // Thời gian bắt đầu thực hiện chính sách
            timeStart: {
                type: Date
            },
            // Tên người giám sát
            nameSupervisor: {
                type: String
            },
            // Mô tả chính sách cụ thể
            descriptionPolicySpecific: {
                type: String
            },
            // Nội dung chính sách
            content: {
                type: String
            },
            // Áp dụng cho đối tượng nào
            applyFor: {
                type: String
            },
            // Trạng thái chính sách bị xoá hay chưa
            isDelete: {
                type: Boolean,
                default: false
            },
            // Người tạo chính sách cụ thê
            createdBy: {
                type: String
            },
            // Tên file kèm theo chính sách cụ thể
            file: {
                type: String
            },
            // Ngày tạo chính sách cụ thể
            createdAt: {
                type: Date,
                default: Date.now()
            },
            // Ngày xoá chính sách cụ thể
            deletedAt: {
                type: Date,
                default: Date.now()
            }
        }],
        default: null,
    }
});

module.exports = mongoose.model("EmployeePolicys", EmployeePolicySchema);