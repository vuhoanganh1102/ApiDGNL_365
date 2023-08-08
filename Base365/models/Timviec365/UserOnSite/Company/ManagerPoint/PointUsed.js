const mongoose = require('mongoose');
const Tv365PointUsedSchema = new mongoose.Schema({
    usc_id: {
        type: Number,
        default: 0
    },
    use_id: {
        type: Number,
        default: 0
    },
    point: {
        type: Number,
        default: 0
    },
    money: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        default: 0
    },
    /**
     * loại thanh toán:
     * - 0: usc_point
     * - 1: usc_money
     * */
    type_payment: {
        type: Number,
        default: 0
    },
    type_err: {
        type: Number,
        default: 0
    },
    note_uv: {
        type: String,
        default: null
    },
    used_day: {
        type: Number,
        default: 0
    },
    return_point: {
        type: Number,
        default: 0
    },
    admin_id: {
        type: Number,
        default: 0
    },
    ip_user: {
        type: String,
        default: null
    },
}, {
    collection: 'Tv365PointUsed',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Tv365PointUsed", Tv365PointUsedSchema);