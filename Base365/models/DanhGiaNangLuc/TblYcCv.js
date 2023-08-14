const mongoose = require('mongoose');
const TblYcCv = new mongoose.Schema({
    id : {
        title: Number,
        required: true
    },
    id_chucvu : {
        title: Number,
        required: true
    },
    ten_yeucau : {
        title: String,
        required: true
    },
    id_pb : {
        title: Number,
        required: true
    },
    mota_yeucau : {
        title: String,
        required: true
    },
    id_congty : {
        title: Number,
        required: true
    }
},{
    collection: "DGNL_TblYcCv",
    versionKey: false
});

module.exports = mongoose.model('DGNL_TblYcCv', TblYcCv);