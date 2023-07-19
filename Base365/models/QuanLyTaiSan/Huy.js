const mongoose = require("mongoose");
const model_Huy = new mongoose.Schema({
    huy_id: {
        type: Number
    },
    huy_taisan: [{
        ds_huy: {
            type: Number
        }
    }
    ],
    id_ng_dexuat: {
        type: Number
    },
    huy_id_bb_cp: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    id_ng_tao: {
        type: Number
    },
    id_ng_duyet: {
        type: Number
    },
    huy_type_quyen_duyet: {
        type: Number
    },
    huy_ngayduyet: {
        type: Number
    },
    huy_trangthai: {
        type: Number
    },
    huy_soluong: {
        type: Number
    },
    huy_lydo_tuchoi: {
        type: String
    },
    huy_lydo: {
        type: String
    },
    huy_type_quyen: {
        type: Number
    },
    huy_id_ng_xoa: {
        type: Number
    },
    xoa_huy: {
        type: Number
    },
    huy_date_create: {
        type: Number
    },
    huy_date_delete: {
        type: Number
    },
    huy_type_quyen_xoa: {
        type: Number
    },
    huy_ng_sd: {
        type: Number
    },
    huy_quyen_sd: {
        type: Number
    }

}, {
    collection: "QLTS_Huy",
    versionKey: false
});
module.exports = mongoose.model("QLTS_Huy", model_Huy);