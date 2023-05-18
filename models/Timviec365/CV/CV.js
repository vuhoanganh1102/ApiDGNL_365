const mongoose = require('mongoose');
// <<<<<<< HEAD
// =======
// const Schema = mongoose.Schema
// >>>>>>> 748dd5dc348c7daf91c661b1ba3ac35519938a3b
const CVSchema = new mongoose.Schema({
    _id: {
        type: Number,
        require: true
    },
    name: {
        type: String,
    },
    alias: {
        type: String,
    },
    urlAlias: {
        type: String,
    },
    urlCanonical: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    color: {
        type: String
    },
    view: {
        type: Number
    },
    favorite: {
        type: Number
    },
    download: {
        type: Number
    },
    vip: {
        type: Number
    },
    cvIndex: {
        type: Number,
    },
    cId: {
        type: Number
    },
    content: {
        type: String
    },
    motaCv: {
        type: String
    },
    htmlVi: {
        type: Object
    },
    htmlEn: {
        type: Object
    },
    htmlJp: {
        type: Object
    },
    htmlCn: {
        type: Object
    },
    htmlKr: {
        type: Object
    },
    cateId: {
        type: Number
    },
    langId: {
        type: Number
    },
    designId: {
        type: Number
    },
    exp: {
        type: Number
    },
    nhuCau: {
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
    thuTu: {
        type: Number
    },
    full: {
        type: String
    },
    status: {
        type: Number
    },
    cvPoint: {
        type: Number
    },

}, {
    collection: 'CV',
    versionKey: false
});
module.exports = mongoose.model("CV", CVSchema);