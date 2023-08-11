const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UvCvmmSchema = new Schema({
    id_uv_cvmm: {
        type: Number,
        required: true,
    },
    cong_viec: {
        type: String,
        default: null,
    },
    nganh_nghe: {
        type: String,
        default: null,
    },
    dia_diem: {
        type: String,
        default: null,
    },
    lever: {
        type: String,
        default: null,
    },
    hinh_thuc: {
        type: Number,
        default: 0,
    },
    luong: {
        type: Number,
        default: 0,
    },
    ky_nang: {
        type: Number,
        default: 0,
    },
},{
    collection: 'VLTH_UvCvmm',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("VLTH_UvCvmm",UvCvmmSchema);
