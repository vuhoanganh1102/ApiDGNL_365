const mongoose = require("mongoose");
const promotionalPriceListSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: String,
    avatar: String,
    thoiHan: Date,
    noiDung: String,
    hot: Number
}, {
    collection: 'PromotionalPriceList',
    versionKey: false,

})

module.exports = mongoose.model('PromotionalPriceList', promotionalPriceListSchema)