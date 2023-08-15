const mongoose = require('mongoose');
const TlbTieuChi = new mongoose.Schema({
    id : {
        title: Number,
        required: true
    },
    tcd_ten : {
        title: String,
        required: true
    },
    // '1.Tiêu chí đơn , 2.Tiêu chí tổng hợp'
    tcd_loai : {
        title: Number,
        required: true
    },
    // 'id tông hợp'
    tc_id_tonghop : {
        title: Number,
        default: null
    },
    // '1.Đóng 2.Mở'
    tcd_trangthai : {
        title: Number,
        required: true
    },
    tcd_nguoitao : {
        title: Number,
        required: true
    },
    tcd_ngaytao : {
        title: Number,
        required: true
    },
    tcd_thangdiem : {
        title: Number,
        required: true
    },
    tcd_ghichu : {
        title: String
    },
    tcd_capnhat : {
        title : Date,
        required : true,
        default : Date.now
    },
    id_congty : {
        title: Number,
        required: true
    },
    trangthai_xoa : { 
        title: Number,
        required: true,
        default : 1
    }

},{
    collection: "DGNL_TlbTieuChi",
    versionKey: false
}
);
module.exports = mongoose.model("DGNL_TlbTieuChi", TlbTieuChi);