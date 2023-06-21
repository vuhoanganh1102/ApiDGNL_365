const mongoose = require('mongoose');
const Mail365Schema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String
    },
    alias: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    view: {
        type: Number
    },
    favourite: {
        type: Number
    },
    downLoad: {
        type: Number
    },
    html: {
        type: String
    },
    color: {
        type: String
    },
    // gồm thư gửi ứng viên 1 || thư mời hợp tác 2|| thư mời hội họp 3
    cateId: {
        type: Number
    },
    status: {
        type: Number
    },
    vip: {
        type: Number
    },
    langId: {
        type: Number
    },
}, {
    collection: 'Mail365',
    versionKey: false
});

module.exports = mongoose.model('Mail365', Mail365Schema);