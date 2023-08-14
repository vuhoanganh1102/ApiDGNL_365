const mongoose = require('mongoose');
const DeKiemTraCauHoi = new mongoose.Schema({
    idkt_id:{
        type: Number,
        require: true,
    }, 
    hinhthuc_taodekt_id:{
        type: Number,
        default: 0,
    }, // '1.Nguowif dungf tuwj tao,2.Heej thoosng tuwj taoj',
    kt_loaikt_id:{
        type: Number,
        default:0,
    }, // '2.tuluan, 1.Trắc nghiệm, 3.ca2',
    ch_thangdiemkt_id:{
        type: Number,
        default: null,
    },
    ten_de_kiemtrakt_id:{
        type: Number,
        require: true,
    }, text,
    nguoitaokt_id:{
        type: Number,
        default:null
    }, 
    ngaytaokt_id:{
        type: String,
        default: null
    }, 
    ghichukt_id:{
        type: String,
        default:null
    }, 
    phanloai_macdinhkt_id:{
        type: String,
        default:null,
    }, 
    phanloaikhackt_id:{
        type: String,
        default:null,
    }, 
    danhsach_cauhoikt_id:{
        type: String,
        default:null,
    }, 
    id_congtykt_id:{
        type: Number,
        default:0,
    }, 
    congty_or_nvkt_id:{
        type: Number,
        default:0,
    }, 
    is_deletekt_id:{
        type: Number,
        default:1,
    }, 
    updated_atkt_id:{
        type: Date,
        default: Date.now,
        require:true
    }, 
}, {
    collection: 'DGNL_DeKiemTraCauHoi',
    
})
module.exports = mongoose.model("DGNL_DeKiemTraCauHoi", DeKiemTraCauHoi);