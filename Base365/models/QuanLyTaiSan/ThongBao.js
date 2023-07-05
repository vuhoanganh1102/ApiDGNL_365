const mongoose = require("mongoose");
const model_ThongBao = new mongoose.Schema({
    id_tb: {
        type: Number
    },
    id_ts: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    id_ng_nhan: {
        type: String
    },
    id_ng_tao: {
        type: Number
    },
    type_quyen: {
        type: Number
    },
    type_quyen_tao: {
        type: Number
    },
    loai_tb: {
        type: Number
    },
    add_or_duyet: {
        tpye: Number
    },
    da_xem: {
        type: Number
    },
    date_create : {
        type : Number
    }
},
    {
        collection: "QLTS_ThongBao",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_ThongBao", model_ThongBao);