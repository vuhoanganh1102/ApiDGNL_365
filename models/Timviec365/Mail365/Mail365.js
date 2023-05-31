const mongoose = require('mongoose');
const Mail365Schema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
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
    cateId: {
        type: Number
    },
    status: {
        type: Number
    },

}, {
    collection: 'Mail365',
    versionKey: false
});

module.exports = mongoose.model('Mail365', Mail365Schema);