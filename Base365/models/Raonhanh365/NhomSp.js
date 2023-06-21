const mongoose = require('mongoose');
const RN365_NhomSpSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        
        type: Number,
        required: true,
    },
    idCate: {
        type: Number,
        required: true,
    },
}, {
    collection: 'RN365_NhomSp',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_NhomSp", RN365_NhomSpSchema);