const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InfringesForSchema = new Schema({
    //Id vi phạm
    _id: {
        type: Number,
        require: true
    },
    // Tên vi phạm
    infringeName: {
        type: String,
        require: true
    },
    //  Căn cứ quy định 
    regulatoryBasis: {
        type: String
    },
    // Số quy định xử lý vi phạm
    number_violation: {
        type: String
    },
    // Danh sách nhân viên
    list: {
        type: [{
            // Id nhân viên
            idUser: {
                type: Number
            },
            // Tên nhân viên
            name: {
                type: String
            }
        }],
        default: null
    },
    // Người tạo
    content: {
        type: String,
    },
    // Người tạo khen thưởng
    createdBy: {
        type: String,
    },
    // Ngày tạo vi phạm
    infringeAt: {
        type: Date,
    },
    // Loại phạt vi phạm
    infringeType: {
        type: {
            id: {
                type: Number

            },
            nameType: {
                type: String
            }
        },
        default: null
    },
    // 
    type: {
        type: Number
    },
    // Id công ty có quyết định xử lý vi phạm
    companyID: {
        type: String
    },
    // Id phòng của nhân viên vi phạm
    depId: {
        type: Number
    },
    // Tên phòng của nhân viên vi phạm
    depName: {
        type: String
    },
    // Ngày tạo quyết định
    createdAt: {
        type: Date,
        default: Date.now()
    },
    // Ngày xoá quyết định
    deleteAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("InfringesFors", InfringesForSchema);