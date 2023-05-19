const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    adminID: {
        type: Number,
        default: 0
    },
    langID: {
        type: Number,
        default: 1
    },
    title: {
        type: String,
        default: null
    },
    titleRewrite: {
        type: String,
        default: null
    },
    redirect301: {
        type: String,
        default: null
    },
    canonical: {
        type: String,
        default: null
    },
    mail: {
        type: Number,
        default: 0,
    },
    picture: {
        type: String,
        default: null
    },
    teaser: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    thongTin: {
        type: String,
        default: null
    },
    des: {
        type: String,
        default: null
    },
    keyword: {
        type: String,
        default: null
    },
    video: {
        type: String,
        default: null
    },
    categoryID: {
        type: Number,
        default: 0
    },
    categoryCB: {
        type: Number,
    },
    date: Date,
    adminEdit: {
        type: Number,
        default: 0
    },
    dateLastEdit: {
        type: Date,
        default: 0
    },
    order: {
        type: Number,
        default: 0
    },
    hits: {
        type: Number,
        default: 0
    },
    active: {
        type: Number,
        default: 1
    },
    cateUrl: {
        type: String,
        default: null
    },
    hot: {
        type: Number,
        default: 0
    },
    new: {
        type: Number,
        default: 0
    },
    view: {
        type: Number,
        default: 0
    },
    urlLq: {
        type: String,
        default: null
    },
    tagCate: {
        type: Number,
        default: 0,
    },
    Vl: {
        type: String,
        default: null
    },
    tdgy: {
        type: String,
        default: null
    },
    ndgy: {
        type: String,
        default: null
    },
    audio: {
        type: Number,
        default: 0
    },
}, {
    collection: 'Blog',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("Blog", blogSchema);