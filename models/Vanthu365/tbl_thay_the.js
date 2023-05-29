
const mongoose = require('mongoose');
var vanBanThayThe = new mongoose.Schema({
    id_tt: {
        type: Number,
    },
    id_vb_tt: {
        type: Number,

    },
    so_vb_tt: {
        type: String,
        max: 255

    },
    ten_vb_tt: {
        type: String,
        max: 255
    },
    trich_yeu_tt: {
        type: String,
        max: 255
    },
    creattime: {
        type: Number,

    }
})
module.exports = mongoose.model("tbl_thay_the", vanBanThayThe);