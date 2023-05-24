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
    pointUSC: {
        type: Number,
        default: 0,
    },
    pointBaoLuu: {
        type: Number,
        default: 0,
    },
    chuThichBaoLuu: {
        type: String,
        default: null,
    },
    dayResetPoint: {
        type: Date,
        default: null,
    },
    dayResetPoint0: {
        type: Date,
        default: null,
    },
}, {
    collection: 'PointCompany',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("PointCompany", pointCompanySchema);