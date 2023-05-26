const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CategoryRaoNhanh365Schema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },
    adminId: {
        type: Number
    },
    name: {
        type: String
    },
    type: {
        _id: Number,
        name: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
}, {
    collection: 'CategoryRaoNhanh365',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('CategoryRaoNhanh365', CategoryRaoNhanh365Schema);