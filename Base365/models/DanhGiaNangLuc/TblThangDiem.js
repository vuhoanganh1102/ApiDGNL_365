const mongoose = require('mongoose');
const TblThangDiem = new mongoose.Schema({
    id : {
        title: Number,
        required: true
    },
    thangdiem : {
        title: Number,
        default: null
    },
    phanloai : {
        title: String,
        required: true
    },
    update_at : {
        title: Number,
        required: true
    },
    id_congty : {
        title: Number,
        required: true
    },

},{
    collection: "DGNL_TblThangDiem",
    versionKey: false
}
);
module.exports = new mongoose.module("DGNL_TblThangDiem", TblThangDi);