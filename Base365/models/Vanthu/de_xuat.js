const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const de_xuat = new Schema({
    id_de_xuat : {
        type : Number,
        required: true
    },
    name_dx : {
        type : String,

    },
    type_dx : {
        type : Number,

    },
    noi_dung : {
        type : String,

    },
    name_user : {
        type : String,

    },
    id_user : {
        type : Number,

    },
    com_id : {
        type : Number,

    },
    kieu_duyet : {
        type : Number,

    },
    id_user_duyet : {
        type : String,

    },
    id_user_theo_doi : {
        type : String,

    },
    file_kem : {
        type : String,

    },
    type_duyet : {
        type : Number,

    },
    type_time : {
        type : Number,

    },
    time_start_out : {
        type : String,

    },
    time_create : {
        type : Number,
        default : null

    },
    time_tiep_nhan : {
        type : Number,
        default : 0

    },
    time_duyet : {
        type : Number,
        default : 0

    },
    active : {
        type : Number,
    },
    del_type : {
        type : Number,
    }
})
module.exports = mongoose.model("de_xuat", de_xuat);