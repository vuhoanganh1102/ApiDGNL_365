const mongoose = require('mongoose');
const pointCompanySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    uscID: {
        type: Number,
        default: 0,
    },
    point: {
        type: Number,
        default: 0,
    },
    pointCompany: {
        // điểm công ty
        type: Number,
        default: 0,
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
}, {
    collection: 'PointCompany',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("PointCompany", pointCompanySchema);