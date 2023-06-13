const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AchievementForSchema = new Schema({
    //Id khen thưởng
    _id: {
        type: Number,
        require: true
    },
    // Số quyết định khen thưởng
    achievementId: {
        type: String,
        require: true
    },
    // Danh sách được khen thưởng
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
    //Nội dung khen thưởng
    content: {
        type: String,
    },
    // Người tạo khen thưởng
    createdBy: {
        type: String,
    },
    // Ngày khen thưởng
    achievementAt: {
        type: Date,
    },
    // Loại thành tích
    achievementType: {
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
    // Tên gọi thành tích
    appellation: {
        type: String
    },
    // Cấp khen thưởng
    achievementLevel: {
        type: String
    },
    // Id công ty có quyết định khen thưởng
    companyID: {
        type: Number
    },
    // Id phòng của nhân viên được khen thưởng
    depId: {
        type: Number
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

module.exports = mongoose.model("AchievementFors", AchievementForSchema);