const mongoose = require('mongoose');
const Schema = mongoose.Schema
const nopHoSoSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người nộp hồ sơ
        type: Number
    },
    newId: {
        //id tin tuyển dụng
        type: Number
    },
    time: {
        // thời gian nộp hồ sơ
        type: Date
    },
    active: {
        type: Number
    },
    ketQua: {
        //kết quả sau khi nộp hồ sơ
        type: Number
    },
    timePv: {
        type: Date
    },
    timeTvs: {
        type: Date
    },
    timeTve: {
        type: Date
    },
    text: {
        //nhận xét của nhà tuyển dụng về ứng viên
        type: String
    },
    cv: {
        //cv ứng viên
        type: String
    }
}, {
    collection: 'nopHoSo',
    versionKey: false
});

module.exports = mongoose.model("nopHoSo", nopHoSoSchema);