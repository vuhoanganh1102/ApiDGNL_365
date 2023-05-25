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
    type: {
        type: {
            _id: {
                type: Number,
            },
            name: {
                type: String
            },
            alias: {
                type: String
            },
            cateId: {
                type: Number
            },
            sapo: {
                type: String
            },
            content: {
                type: String
            },
            menu: {
                type: Number
            },
            sort: {
                type: Number
            },
            status: {
                type: Number
            }
        },
        default: null

    },


}, {
    collection: 'Mail365Category',
    versionKey: false
});

module.exports = mongoose.model("Mail365Category", Mail365CategorySchema)