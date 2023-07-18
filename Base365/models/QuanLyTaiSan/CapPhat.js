const mongoose = require('mongoose');
const model_CapPhat = new mongoose.Schema({
    _id:{
        type: Number,
        require : true
    },
    cap_phat_taisan:{
        type :String,
    },
    id_cty:{
        type: Number,
    },
    id_nhanvien:{
        type: Number
    },
    id_phongban:{
        type: Number
    },
    id_ng_daidien:{
        type:Number
    },
    id_ng_thuchien:{
        type: Number
    },
    ts_daidien_nhan:{
        type : [String]
    },
    cp_ngay:{
        type: Number
    },
    cp_hoanthanh:{
        type : Number
    },
    cp_trangthai:{
        type : Number
    },
    loai_capphat:{
        type: Number
    },
    cp_vitri_sudung:{
        type :String
    },
    cp_lydo:{
        type:String
    },
    cp_type_quyen:{
        type : Number
    },
    cp_id_ng_tao:{
        type: Number
    },
    cp_id_ng_xoa:{
        type: Number
    },
    cp_da_xoa:{
        type: Number
    },
    cp_date_create:{
        type: Number
    },
    cp_date_delete:{
        type : Number
    },
    cp_type_quyen_xoa:{
        type: Number
    },
    cp_tu_choi_ban_giao: {
        type :String
    },
    cp_tu_choi_tiep_nhan:{
        type :String
    }

});
module.exports = mongoose.model("QLTS_Cap_Phat",model_CapPhat);