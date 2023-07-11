const mongoose = require("mongoose");
const model_Tai_San = new mongoose.Schema({
    ts_id: {
        type: Number,
        require : true
    },
    id_cty: {
        type: Number
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
        type : Number,
        default : 0
    },
    ts_type_quyen : {
        type : String,
        default : 0
    },
    ts_type_quyen_xoa : {
        type : Number,
        default : 0
    },
    ts_id_ng_xoa : {
        type : String,
        default : ''
    },
    ts_da_xoa : {
        type : Number,
        default : 0
    },
    ts_date_create : {
        type : String
    },
    ts_date_delete : {
        type : Number,
        default : 0
    },
    don_vi_tinh : {
        type : String,
        default : 0
    },
    ghi_chu : {
        type : String,
        default : ''
    }
},
    {
        collection: "QLTS_Tai_San",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Tai_San", model_Tai_San);