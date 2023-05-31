const mongoose = require('mongoose');
const pointCompanySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    uscID: Number,
    point: {
        type: Number,
        required: true,
    },
    pointCompany: {
        // điểm công ty
        type: Number,
        required: true,
    },
    reservationPoint: {
        // điểm bảo lưu
        type: Number,
        default: 0,
    },
    note: {
        // chú thích bảo lưu
        type: String,
        default: null,
    },
    dateResetPoint: {
        // ngày reset point
        type: Date,
        default: null,
    },
    dateResetPointToZero: {
        // ngày reset point về 0
        type: Date,
        default: null,
    },
    chuThichBaoLuu: String,
    dayResetPoint: Date,
    dayResetPoint0: Date,
}, {
    collection: 'PointCompany',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("PointCompany", pointCompanySchema);