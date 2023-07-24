const mongoose = require("mongoose");
const model_TaiSanDangSuDung = new mongoose.Schema({
    id_sd: {
        type: Number,
        required: true,
        unique: true
    },
    com_id_sd: {
        type: Number
    },
    id_nv_sd: {
        type: Number
    },
    id_pb_sd: {
        type: Number
    },
    id_ts_sd: {
        type: Number
    },
    sl_dang_sd: {
        type: Number
    },
    doi_tuong_dang_sd: {
        type: Number
    },
    day_bd_sd: {
        type: Number
    },
    tinhtrang_ts: {
        type: Number
    }
},
    {
        collection: "QLTS_TaiSanDangSuDung",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_TaiSanDangSuDung", model_TaiSanDangSuDung);