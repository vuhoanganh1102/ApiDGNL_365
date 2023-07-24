const mongoose = require("mongoose");
const model_TheoDoiCongSuat = new mongoose.Schema({
    id_cs: {
        type: Number,
        unique: true
    },
    id_cty: {
        type: Number,

    },
    id_loai: {
        type: Number
    },
    id_donvi: {
        type: Number
    },
    update_cs_theo: {
        type: Number
    },
    nhap_ngay: {
        type: Number
    },
    chon_ngay: {
        type: Number
    },
    cs_gannhat: {
        type: Number
    },
    tdcs_type_quyen: {
        tpye: Number
    },
    tdcs_id_ng_xoa: {
        type: Number
    },
    tdcs_xoa : {
        type : Number
    },
    tdcs_date_create : {
        type : Number
    },
    tdcs_date_delete : {
        type : Number
    },
    date_update : {
        type : Number
    },
    tdcs_type_quyen_xoa : {
        type : Number
    }
},
    {
        collection: "QLTS_TheoDoiCongSuat",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_TheoDoiCongSuat", model_TheoDoiCongSuat);