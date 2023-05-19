const mongoose = require('mongoose');
const donUVSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người tạo đơn
        type: Number
    },
    tId: {

        type: Number
    },
    Status: {
        // trạng thái
        type: Number
    },
    lang: {
        //ngôn ngữ tạo đơn
        type: Number
    },
    html: {
        // nội dung đơn
        type: Number
    },
    nameImg: {
        // tên ảnh
        type: Number
    },
}, {
    collection: 'donUV',
    versionKey: false
});

module.exports = mongoose.model("donUV", donUVSchema);