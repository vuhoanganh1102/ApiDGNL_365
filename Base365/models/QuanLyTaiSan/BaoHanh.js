const mongoose = require("mongoose");;
const model_Baohanh = new mongoose.Schema({
    bh_id: {
        type: Number,
    },
    baohanh_taisan: {
        type: String,
    },
    id_cty: {
        type: Number,
    },
    bh_thoigian: {
        type: Number,
    },
    bh_loai_thoigian: {
        type: Number,
    },
    bh_dieu_kien: {
        type: String,
    },
    bh_han_bh: {
        type: Number,
    },
    xoa_baohanh: {
        type: Number,
    },
    date_delete: {
        type: Number
    },
    date_create: {
        type: Number
    },

},
    {
        collection: "QLTS_Bao_Hanh",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_Bao_Hanh", model_Baohanh);