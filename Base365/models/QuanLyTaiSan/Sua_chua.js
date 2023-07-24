const mongoose = require("mongoose");
const model_Sua_chua = new mongoose.Schema({
    sc_id: {
        type: Number,
        unique: true
    },
    suachua_taisan: {
        type: Number
    },
    sl_sc: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    sc_ng_thuchien: {
        type: String
    },
    sc_ng_duyet: {
        type: Number
    },
    sc_date_duyet: {
        type: String
    },
    sc_trangthai: {
        type: Number
    },
    sc_ngay_hong: {
        tpye: String
    },
    sc_ngay: {
        type: Number
    },
    sc_dukien: {
        type: Number
    },
    sc_hoanthanh: {
        type: Number
    },
    sc_noidung: {
        type: String
    },
    sc_chiphi_dukien: {
        type: Number
    },
    sc_chiphi_thucte: {
        type: Number
    },
    sc_donvi: {
        type: String
    },
    sc_loai_diadiem: {
        type: Number
    },
    sc_diachi: {
        type: String
    },
    sc_ngay_nhapkho: {
        type: Number
    },
    sc_lydo_tuchoi: {
        type: String
    },
    sc_type_quyen: {
        type: Number
    },
    sc_id_ng_tao: {
        type: Number
    },
    sc_id_ng_xoa: {
        type: Number
    },
    sc_da_xoa: {
        type: Number
    },
    sc_date_create: {
        type: Number
    },
    sc_date_delete: {
        type: Number
    },
    sc_ng_sd: {
        type: Number
    },
    sc_quyen_sd: {
        type: Number
    },
    sc_ts_vitri: {
        type: String
    },
    sc_type_quyen_xoa: {
        type: Number
    },
    sc_type_quyet_duyet: {
        type: Number
    },
},
    {
        collection: "QLTS_Sua_chua",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Sua_chua", model_Sua_chua);