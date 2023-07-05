const mongoose = require("mongoose");
const model_QuaTrinhSuDung = new mongoose.Schema({
    quatrinh_id: {
        type: Number
    },
    id_ts: {
        type: Number
    },
    id_bien_ban: {
        type: Number
    },
    so_lg: {
        type: String
    },
    id_cty: {
        type: String
    },
    id_ng_sudung: {
        type: String
    },
    id_phong_sudung: {
        type: String
    },
    id_cty_sudung: {
        type: String
    },
    qt_ngay_thuchien: {
        tpye: String
    },
    qt_nghiep_vu: {
        type: String
    },
    vitri_ts : {
        type : String
    },
    ghi_chu : {
        type : String
    },
    time_created : {
        typoe : Number
    }
},
    {
        collection: "QLTS_QuaTrinhSuDung",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_QuaTrinhSuDung", model_QuaTrinhSuDung);