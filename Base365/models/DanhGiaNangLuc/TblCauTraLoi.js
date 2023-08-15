const mongoose = require('mongoose');
const TblCauTraLoi = new mongoose.Schema({
  id: {
    title: Number,
    required: true
    },
    ma_nv: {
        title: Number,
        required: true
    },
    cau_traloi: {
        title: String,
        required: true
    },
    trangthai_lam : {
        title: Number,
        // trạng thái   0 là đang làm , 1 là hoàn thành 
        required: true
    },
    id_congty : {
        title: Number,
        required: true
    },
    phieu_id : {
        title: Number,
        required: true
    },
} ,{
  collection: "DGNL_TblCauTraLoi",
  versionKey: false,
} 
);
module.exports = mongoose.model("DGNL_TblCauTraLoi", TblCauTraLoi);