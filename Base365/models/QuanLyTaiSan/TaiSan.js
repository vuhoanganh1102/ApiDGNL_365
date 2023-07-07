const mongoose = require("mongoose");
const model_Tai_San = new mongoose.Schema({
    ts_id: {
        type: Number
    },
    id_cty: {
        type: String
    },
    id_loai_ts: {
        type: Number
    },
    id_nhom_ts: {
        type: Number
    },
    id_dv_quanly: {
        type: String
    },
    id_ten_quanly: {
        type: Number
    },
    ts_ten: {
        type: String
    },
    sl_bandau: {
        type: Number
    },
    ts_so_luong: {
        tpye: String
    },
    soluong_cp_bb: {
        type: Number
    },
    ts_gia_tri : {
        type : Number
    },
    ts_don_vi : {
        type : String
    },
    ts_vi_tri : {
        type : Number
    },
    ts_trangthai : {
        type : Number
    },
    ts_date_sd : {
        type : Number
    },
    ts_type_quyen : {
        type : String
    },
    ts_type_quyen_xoa : {
        type : Number
    },
    ts_id_ng_xoa : {
        type : String
    },
    ts_da_xoa : {
        type : Number
    },
    ts_date_create : {
        type : String
    },
    ts_date_delete : {
        type : Number
    },
    don_vi_tinh : {
        type : Number
    },
    ghi_chu : {
        type : Number
    }
},
    {
        collection: "QLTS_Tai_San",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Tai_San", model_Tai_San);