const mongoose = require('mongoose');
const RN365_TangPhongSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    soLuong: {
        
        type: Number,
        required: true,
    },
    type_zoom:{
        type: Number,
        required: true,
    },
    idCate: {
        type: Number,
        required: true,
    },
}, {
    collection: 'RN365_TangPhong',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_TangPhong", RN365_TangPhongSchema);