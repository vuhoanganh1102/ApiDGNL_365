const mongoose = require("mongoose");
const model_LoaiTanSan = new mongoose.Schema({
    id_loai: {
        type: Number
    },
    ten_loai: {
        type: String
    },
    id_nhom_ts: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    loai_type_quyen: {
        type: Number
    },
    loai_id_ng_xoa: {
        type: Number
    },
    loai_da_xoa: {
        type: Number
    },
    loai_date_create: {
        type: Number
    },
    loai_date_delete: {
        type: Number
    },
    loai_type_quyen_xoa: {
        type: Number
    }
},
    {
        collection: "QLTS_Loai_Tai_San",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Loai_Tai_San", model_LoaiTanSan);