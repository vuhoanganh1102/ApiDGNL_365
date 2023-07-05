const mongoose = require("mongoose");
const model_NhomTaiSan= new mongoose.Schema({
    id_nhom: {
        type: Number
    },
    ten_nhom: {
        type: String
    },
    id_cty: {
        type: Number
    },
    nhom_type_quyen: {
        type: Number
    },
    nhom_id_ng_xoa: {
        type: Number
    },
    nhom_da_xoa: {
        type: Number
    },
    nhom_date_create: {
        type: Number
    },
    nhom_date_delete:{
        type : Number
    },
    nhom_type_quyen_xoa:{
        type : Number
    }
},{
    collection: "QLTS_Nhom_Tai_San",
    versionKey: false
}
);
module.exports = mongoose.model("QLTS_Nhom_Tai_San",model_NhomTaiSan )