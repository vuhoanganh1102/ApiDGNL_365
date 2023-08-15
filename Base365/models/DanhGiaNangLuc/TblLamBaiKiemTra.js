const mongoose = require('mongoose');
const TblLamBaiKiemTra = new mongoose.Schema({
    id: {
        title:Number,
        required: true
    },
    id_nv: {
        title:Number,
        required: true
    },
    phieu_id: {
        title:Number,
        required: true
    },
    cau_trl: {
        title:Number,
        required: true
    },
}, {
    collection: "DGNL_TblLamBaiKiemTra",
    versionKey: false
}
);
module.exports = mongoose.model("DGNL_TblLamBaiKiemTra", TblLamBaiKiemTra);