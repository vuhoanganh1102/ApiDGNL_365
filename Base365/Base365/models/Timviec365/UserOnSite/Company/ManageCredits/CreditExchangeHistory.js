const mongoose = require('mongoose');
const CreditExchangeHistorySchema = new mongoose.Schema(
    {
        //idTimViec365
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        userId: {
            type: Number,
            required: true,
        },
        userType: {
            type: Number,
            default: 0
        },
        //điểm đổi
        point: {
            type: Number,
            default: 0
        },
        //số tiền tương ứng(VND)
        money: {
            type: Number,
            default: 0
        },
        //số điểm còn lại
        point_later: {
            type: Number,
            default: 0
        },
        //0: chưa dùng tiền mua hàng, 1: đã dùng mua hàng
        is_used: {
            type: Number,
            default: 0
        },
        time: {
            type: Number,
            default: 0
        },
    },
    {
        collection: "TV365SaveExchangePoint"
    })
module.exports = mongoose.model("TV365SaveExchangePoint", CreditExchangeHistorySchema);