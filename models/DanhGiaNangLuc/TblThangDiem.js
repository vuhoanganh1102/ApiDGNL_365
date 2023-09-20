const mongoose = require('mongoose');
const TblThangDiem = new mongoose.Schema({
    id : {
        type: Number,
        required: true
    },
    thangdiem : {
        type: Number,
        default: null
    },
    phanloai : {
        type: String,
        required: true
    },
    update_at : {
        type: Number,
        required: true
    },
    id_congty : {
        type: Number,
        required: true
    },

},{
    collection: "DGNL_TblThangDiem",
    versionKey: false
}
);
module.exports = new mongoose.module("DGNL_TblThangDiem", TblThangDiem);