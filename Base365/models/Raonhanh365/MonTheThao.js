const mongoose = require('mongoose');
const RN365_MonTheThaoSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
    },
    name: {
        
        type: Number,
        required: true,
    },
   
    phanLoai: {
        type: Number,
        required: true,
    },
}, {
    collection: 'RN365_MonTheThao',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_MonTheThao", RN365_MonTheThaoSchema);