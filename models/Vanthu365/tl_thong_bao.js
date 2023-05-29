const mongoose = require('mongoose');
const tl_ThongBao = new mongoose.Schema({
    id_thong_bao: {
        type: Number
    },
    id_user: {
        type: Number
    },
    id_user_nhan: {
        type: Number
    },
    id_van_ban: {
        type: Number
    },
    type: {
        type: Number
    },
    view: {
        type: Number
    },
    created_date: {
        type: Number
    }

});
module.exports = mongoose.model("tl_thong_bao", tl_ThongBao);
