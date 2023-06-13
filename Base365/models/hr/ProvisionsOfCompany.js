const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProvisionsOfCompanySchema = new Schema({
    //Id quy định nhân viên
    _id: {
        type: Number,
        require: true
    },
    // Tên nhóm quy định
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
    // Mô tả quy định
    description: {
        type: String,
    },
    // Trạng thái quy định đã bị xoá hay chưa
    isDelete: {
        type: Boolean,
        default: false
    },
    // Id công ty tạo quy định
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Companys'
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
    // Quy định cụ thể
    policy: {
        type: [{
            // Id quy định cụ thể
            _id: {
                type: Number,
                require: true
            },
            // Tên quy định cụ thể
            name: {
                type: String
            },
            // Thời gian bắt đầu thực hiện quy định
            timeStart: {
                type: Date
            },
            // Tên người giám sát
            nameSupervisor: {
                type: String
            },
            // Mô tả quy định cụ thể
            description: {
                type: String
            },
            // Nội dung quy định    
            content: {
                type: String
            },
            // Áp dụng cho đối tượng nào
            applyFor: {
                type: String
            },
            // Trạng thái quy định bị xoá hay chưa
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

module.exports = mongoose.model("ProvisionsOfCompanys", ProvisionsOfCompanySchema);