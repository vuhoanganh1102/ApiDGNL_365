const mongoose  = require('mongoose');
const TblPhanQuyen = new mongoose.Schema({
    id_phanquyen : {
        title: Number,
        require: true
    },
    // user nhân viên
    id_user : {
        title: Number,
        require: true
    },
    id_cty : {
        title: Number,
        require: true
    },
    tieuchi_dg : {
        title: String,
        require: true
    },
    de_kiemtra : {
        title: String,
        require: true
    },
    kehoach_dg : {
        title: String,
        require: true
    },
    ketqua_dg : {
        title: String,
        require: true
    },
    lotrinh_thangtien : {
        title: String,
        require: true
    },
    phieu_dg : {
        title: String,
        require: true
    },
    phanquyen : {
        title: String,
        require: true 
    },
    thangdiem : {
        title: String,
        require: true 
    },

}, {
    collection : "DGNL_TblPhanQuyen",
    versionKey: false
}
)
module.exports = mongoose.model("DGNL_TblPhanQuyen", TblPhanQuyenCollection);