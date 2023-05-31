const mongoose = require('mongoose');
const keywordSchema = new mongoose.Schema({
    _id: {
        type: Number,
    },
    name: {
        type: String,
    },
    lq: {
        type: Date,
    },
    cateID: {
        type: Number,
    },
    cityID: {
        type: Number,
        ref: 'City'
    },
    qhID: {
        type: Number,
    },
    cbID: {
        type: Number,
    },
    teaser: {
        type: String,
    },
    type: {
        type: Number,
    },
    err: {
        type: Number,
    },
    qhKcn: {
        type: Number,
    },
    cateLq: {
        type: Number,
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    keyword: {
        type: String,
    },
    h1: {
        type: String,
    },
    createTime: {
        type: Date,
    },
    redirect301: {
        type: String,
    },
    index: {
        type: Number,
    },
    baoHam: {
        type: Number,
    },
    tdgy: {
        type: String,
    },
    ndgy: {
        type: String,
    },
}, {
    collection: 'KeyWord',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("KeyWord", keywordSchema);