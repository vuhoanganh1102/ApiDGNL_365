const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
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
    collection: 'Category',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('Category', CategorySchema);