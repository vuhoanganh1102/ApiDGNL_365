const mongoose = require("mongoose");
const model_ThongTinTuyChinh = new mongoose.Schema({
    id_tt: {
        type: Number
    },
    com_id_tt: {
        type: Number
    },
    id_nhom_ts: {
        type: Number
    },
    tt_ten_truong: {
        type: String
    },
    kieu_du_lieu: {
        type: Number
    },
    noidung_mota: {
        type: String
    },
    ng_tao: {
        type: Number
    },
    type_quyen_tao: {
        type: Number
    },
    tt_date_create: {
        tpye: Number
    },
    tt_xoa: {
        type: Number
    },
    ng_xoa : {
        type : Number
    },
    ngay_xoa : {
        type : Number
    },
    type_quyen_xoa : {
        type : Number
    }
},
    {
        collection: "QLTS_hongTinTuyChinh",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_ThongTinTuyChinh", model_ThongTinTuyChinh);