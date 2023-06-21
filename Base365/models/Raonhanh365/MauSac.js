const mongoose = require('mongoose');
const RN365_MauSacSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        
        type: Number,
        required: true,
    },
    parentId:{
        type: Number,
        required: true,
    },
    idCate: {
        type: Number,
        required: true,
    },
}, {
    collection: 'RN365_MauSac',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_MauSac", RN365_MauSacSchema);