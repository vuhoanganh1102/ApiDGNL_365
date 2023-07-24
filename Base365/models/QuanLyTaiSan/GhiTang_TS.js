const mongoose = require("mongoose");
const model_GhiTangTS = new mongoose.Schema({
    id_ghitang: {
        type: Number,
        unique: true
    },
    id_ts: {
        type: Number
    },
    id_ts: {
        type: Number
    },
    sl_tang: {
        type: Number
    },
    id_ng_tao: {
        type: Number
    },
    type_quyen_tao: {
        type: Number
    },
    id_ng_duyet: {
        type: Number
    },
    type_quyen_duyet: {
        type: Number
    },
    id_ng_xoa: {
        type: Number
    },
    type_ng_xoa: {
        type: Number
    },
    day_duyet: {
        type: Number
    },
    day_tao: {
        type: Number
    },
    day_xoa: {
        type: Number
    },
    xoa_ghi_tang: {
        type: Number
    },
    trang_thai_ghi_tang: {
        type: Number
    },
    gt_ghi_chu: {
        type: String
    },
    lydo_tu_choi: {
        type: String
    }

},
    {
        collection: "QLTS_Ghi_Tang_TS",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Ghi_Tang_TSv", model_GhiTangTS);