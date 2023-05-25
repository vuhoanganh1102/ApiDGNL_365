// danh mục mail365
const mongoose = require('mongoose');
const Mail365CategorySchema = new mongoose.Schema({
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
    parent: {
        type: Number
    },
    metaTitle: {
        type: String
    },
    metaKey: {
        type: String
    },
    metaDes: {
        type: String
    },
    sort: {
        type: Number
    },
    content: {
        type: String
    },
    status: {
        type: Number
    },


}, {
    collection: 'Mail365Category',
    versionKey: false
});

module.exports = mongoose.model("Mail365Category", Mail365CategorySchema)