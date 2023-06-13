const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CityRNSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        //ten
        type: String,
        default: null,
    },
    order: {
        //do uu tien
        type: Number,
        default: 0,
    },
    type: {
        //khu vuc vung(mien bac/trung/nam)
        type: Number,
        default: 0,
    },
    count: {
        //chua ro
        type: Number,
        default: 0,
    },
    parentId: {
        //quan huyen cua city
        type: Number,
        default: 0,
    },

}, {
    collection: 'CityRN',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("CityRN", CityRNSchema);