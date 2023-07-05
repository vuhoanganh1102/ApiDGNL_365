const mongoose = require("mongoose");
const model_DonViCS = new mongoose.Schema({
    id_donvi: {
        type: Number
    },
    id_cty: {
        type: Number
    },
    ten_donvi: {
        type: String
    },
    mota_donvi: {
        type: String,

    },
    dvcs_type_quyen: {
        type: Number
    },
    dvcs_id_ng_xoa: {
        type: Number
    },
    donvi_xoa: {
        type: Number
    },
    dvcs_date_create: {
        type: Number
    },
    dvcs_date_delete: {
        type: Number
    },
    dvcs_type_quyen_xoa: {
        type: Number
    },
}, {
    collection: "QLTS_Don_Vi_CS",
    versionKey: false
});
module.exports = mongoose.model("QLTS_Don_Vi_CS", model_DonViCS);