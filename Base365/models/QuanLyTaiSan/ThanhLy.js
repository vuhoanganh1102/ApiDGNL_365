const mongoose = require("mongoose");
const model_ThanhLy = new mongoose.Schema({
    _id: {
        type: Number
    },
    thanhly_taisan: {
        type: String
    },
    tl_id_bb_cp: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    id_ngtao: {
        type: Number
    },
    id_tl_phongban: {
        type: Number
    },
    id_ngdexuat: {
        type: Number
    },
    id_ng_duyet: {
        type: Number
    },
    ngay_duyet: {
        tpye: Number
    },
    type_quyen_duyet: {
        type: Number
    },
    tl_ngay : {
        type : Number
    },
    tl_soluong : {
        type : Number
    },
    tl_giatri : {
        type : Number
    },
    tl_sotien : {
        type : Number
    },
    tl_lydo : {
        type : String
    },
    tl_lydo_tuchoi : {
        type : String
    },
    tl_trangthai : {
        type : Number
    },
    tl_loai_gt : {
        type : Number
    },
    tl_phantram : {
        type : Number
    },
    tl_type_quyen : {
        type : Number
    },
    tl_id_ng_xoa : {
        type : Number
    },
    xoa_dx_tl : {
        type : Number
    },
    tl_date_create : {
        type : Number
    },
    tl_date_delete : {
        type : Number
    },
    tl_type_quyen_xoa : {
        type : Number
    }
},
    {
        collection: "QLTS_ThanhLy",
        versionKey: false
    });
module.exports = mongoose.model("QLTS__ThanhLy", model_ThanhLy);