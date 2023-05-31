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
        required: true,
    },
    time: {
        //thời gian ứng tuyển
        type: Date,
        required: true
    },
    active: {
        // xác nhận ứng tuyển 
        type: Number,
        required: true
    },
    kq: {
        // kết quả ứng tuyển
        type: Number,
        required: true
    },
    timePV: {
        // thời gian phỏng vấn
        type: Date,
        required: true
    },
    timeTVS: {
        type: Date,
        required: true
    },
    timeTVE: {
        type: Date,
        required: true
    },
    text: {
        // lời giới thiệu bản thân 
        type: String,
        required: true
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
    // 1 là ứng viên ứng tuyển , 2 là chuyên viên gửi ứng tuyển
    type: Number,
}, {
    collection: 'ApplyForJob',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("ApplyForJob", applyForJobSchema);