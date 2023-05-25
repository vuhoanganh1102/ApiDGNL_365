const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        // tên ngành nghề
        type: String,
        required: true
    },
    title: {
        // tiêu đề
        type: String,
        default: null
    },

    tags: {
        // name tag
        type: String,
        default: null
    },
    description: {
        // chi tiết 
        type: String,
        default: null

    },
    keyword: {
        // từ khóa
        type: String,
        default: null

    },
    des: {
        // mô tả
        type: String,
        default: null

    },
    parentID: {
        // id cha
        type: Number,
        default: 0

    },
    count: {
        // 
        type: Number,
        default: 0

    },
    order: {
        // ưu tiên
        type: Number,
        default: 0

    },
    active: {
        // kích hoạt
        type: Number,
        default: 0

    },
    hot: {
        // 
        type: Number,
        default: 0
    }
}, {
    collection: 'CategoryJob',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CategoryJob", jobSchema);