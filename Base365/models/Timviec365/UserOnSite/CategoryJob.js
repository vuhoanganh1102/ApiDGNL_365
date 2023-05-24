const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    // tên ngành nghề
    name: {
        type: String,
        required: true
    },
    // tiêu đề
    title: {
        type: String,
        default: null
    },
    // name tag
    tags: {
        type: String,
        default: null
    },
    // chi tiết 
    description: {
        type: String,
        default: null

    },
    // từ khóa
    keyword: {
        type: String,
        default: null

    },
    // mô tả
    des: {
        type: String,
        default: null

    },
    // id cha
    parentID: {
        type: Number,
        default: 0

    },
    // 
    count: {
        type: Number,
        default: 0

    },
    // ưu tiên
    order: {
        type: Number,
        default: 0

    },
    // kích hoạt
    active: {
        type: Number,
        default: 0

    },
    // 
    hot: {
        type: Number,
        default: 0
    }
}, {
    collection: 'CategoryJob',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CategoryJob", jobSchema);