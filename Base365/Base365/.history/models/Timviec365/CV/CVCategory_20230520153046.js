const mongoose = require('mongoose'); // danh mục cv
const DanhMucCVSchema = new mongoose.Schema({
    _id: {
        type: Number
    },
    name: {
        type: String
    },
    shortName: {
        type: String
    },
    alias: {
        type: String
    },
    image: {
        type: String
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
    metaTitle: {
        type: String
    },
    metaKey: {
        type: String
    },
    metaDes: {
        type: String
    },
    status: {
        type: Number
    }

}, {
    collection: 'DanhMucCV',
    versionKey: false
});

module.exports = mongoose.model("DanhMucCV", DanhMucCVSchema)