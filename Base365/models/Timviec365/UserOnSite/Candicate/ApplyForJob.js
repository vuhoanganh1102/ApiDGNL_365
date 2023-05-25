const mongoose = require('mongoose');
const applyForJobSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    userID: {
        type: Number,
        required: true,
    },
    comID: {
        //id công ty
        type: Number,
        default: 0,
    },
    newID: {
        type: Number,
        default: 0,
    },
    time: {
        //thời gian ứng tuyển
        type: Date,
        default: null,
    },
    active: {
        // xác nhận ứng tuyển 
        type: Number,
        default: 0,
    },
    kq: {
        // kết quả ứng tuyển
        type: Number,
        default: 0,
    },
    timePV: {
        // thời gian phỏng vấn
        type: Date,
        default: null,
    },
    timeTVS: {
        type: Date,
        default: null,
    },
    timeTVE: {
        type: Date,
        default: null,
    },
    text: {
        // lời giới thiệu bản thân 
        type: String,
        default: null,
    },
    cv: {
        // file cv
        type: String,
        default: null,
    },

    type: {
        // 1 là ứng viên ứng tuyển , 2 là chuyên viên gửi ứng tuyển
        type: Number,
        default: 0,
    },
}, {
    collection: 'ApplyForJob',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("ApplyForJob", applyForJobSchema);