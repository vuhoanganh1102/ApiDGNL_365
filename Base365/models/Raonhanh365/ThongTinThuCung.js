const mongoose = require('mongoose');
const RN365_ThongTinThuCungSchema = new mongoose.Schema({
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
    collection: 'RN365_ThongTinThuCung',
    versionKey: false,
    timestamp: true
})

module.exports = mongoose.model("RN365_ThongTinThuCung", RN365_ThongTinThuCungSchema);