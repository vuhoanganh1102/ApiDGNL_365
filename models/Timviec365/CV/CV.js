const mongoose = require('mongoose');
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
    url_alias: {
        type: String,
    },
    url_canonical: {
        type: String,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
    },
    colors: {
        type: String
    },
    view: {
        type: Number
    },
    love: {
        type: Number
    },
    download: {
        type: Number
    },
    vip: {
        type: Number
    },
    cv_index: {
        type: Number,
    },
    cid: {
        type: Number
    },
    content: {
        type: String
    },
    mota_cv: {
        type: String
    },
    html_vi: {
        type: Object
    },
    html_en: {
        type: Object
    },
    html_jp: {
        type: Object
    },
    html_cn: {
        type: Object
    },
    html_kr: {
        type: Object
    },
    cate_id: {
        type: Number
    },
    lang_id: {
        type: Number
    },
    design_id: {
        type: Number
    },
    exp: {
        type: Number
    },
    nhucau: {
        type: Number
    },
    meta_title: {
        type: String
    },
    meta_key: {
        type: String
    },
    meta_des: {
        type: String
    },
    thutu: {
        type: Number
    },
    full: {
        type: String
    },
    status: {
        type: Number
    },
    cv_point: {
        type: Number
    },

}, {
    collection: 'CV',
    versionKey: false
})

module.exports = mongoose.model("CV", CVSchema);

// { collection: 'CV',
//       versionKey: false}