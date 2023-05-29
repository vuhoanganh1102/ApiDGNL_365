const mongoose = require('mongoose');
const CategoryCompanySchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    // tên lĩnh vực
    nameTag: String,
    cityTag: Number,
    cateID: Number,
    parentID: Number,
    leverID: Number,
    keywordTag: String,
    TagContent: String,
    link301: String,
    tagVlgy: String,
    tagNdgy: String,
    tagIndex: Number

}, {
    collection: 'CategoryCompany',
    versionKey: false,
    timestamp: true
})
module.exports = mongoose.model("CategoryCompany", CategoryCompanySchema);