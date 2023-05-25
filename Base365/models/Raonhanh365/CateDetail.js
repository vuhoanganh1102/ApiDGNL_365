const mongoose = require('mongoose');
const CateDetailSchema = mongoose.Schema({
    _id: {
        type: Number,
        required: true
    },


}, {
    collection: 'CateDetail',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('Category', CateDetailSchema);