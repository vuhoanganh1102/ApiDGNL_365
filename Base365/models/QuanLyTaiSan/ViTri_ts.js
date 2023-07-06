const mongoose = require("mongoose");
const model_ViTri_ts = new mongoose.Schema({
    _id: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    vi_tri: {
        type: String
    },
    dv_quan_ly: {
        type: Number
    },
    quyen_dv_qly: {
        type: Number
    },
    ghi_chu_vitri: {
        type: String
    },
},
    {
        collection: "QLTS_ViTri_ts",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_ViTri_ts", model_ViTri_ts);