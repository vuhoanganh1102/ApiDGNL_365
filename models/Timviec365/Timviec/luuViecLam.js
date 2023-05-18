const mongoose = require('mongoose');
const Schema = mongoose.Schema
const luuViecLamSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        //id người lưu
        type: Number
    },
    newId: {
        //id tin lưu
        type: Number
    },
    saveTime: {
        // thời gian lưu
        type: Date
    },
}, {
    collection: 'luuViecLam',
    versionKey: false
});

module.exports = mongoose.model("luuViecLam", luuViecLamSchema);