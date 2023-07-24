const mongoose = require("mongoose");
const model_Dieuchuyen = new mongoose.Schema({
    dc_id: {
        type: Number,
        unique: true
    },
    id_cty: {
        type: Number
    },
    dieuchuyen_taisan:{
        ds_dc : {
            type: [
              {
                ts_id: {
                  type: Number
                },
                sl_ts: {
                  type: Number
                }
              }
            ]
          }
    },
    taisan_thucnhan: {
        type: String
    },
    id_ng_thuchien: {

        type: Number
    },
    id_cty_dang_sd: {
        type: Number
    },
    id_pb_dang_sd: {
        type: Number
    },
    id_daidien_dangsd: {
        type: String,
        default: 0,
    },
    id_nv_dangsudung: {
        type: Number,
        default: 0,
    },
    id_cty_nhan: {
        type: Number
    },
    id_nv_nhan: {
        type: Number
    },
    id_pb_nhan: {
        type: Number
    },
    id_daidien_nhan: {
        type: String,
        default: 0,
    },
    dc_ngay: {
        type: Number
    },
    dc_hoan_thanh: {
        type: Number
    },
    dc_trangthai: {
        type: Number
    },
    dc_tu: {
        type: String
    },
    dc_den: {
        type: String
    },
    dc_lydo: {
        type: String
    },
    dc_lydo_tuchoi: {
        type: String
    },
    dc_lydo_tuchoi_tiepnhan: {
        type: String
    },
    dc_ghichu_tiepnhan: {
        type: String
    },
    vi_tri_dc_tu: {
        type: String
    },
    dc_vitri_tsnhan: {
        type: String
    },
    vitri_ts_daidien: {
        type: String
    },
    dc_type_quyen: {
        type: Number
    },
    dc_type: {
        type: Number
    },
    id_ng_xoa_dc: {
        type: Number
    },
    id_ng_tao_dc: {
        type: Number
    },
    xoa_dieuchuyen: {
        type: Number,
        default : 0
    },
    dc_date_delete: {
        type: Number
    },
    dc_date_create: {
        type: Number
    },
    dc_type_quyen_xoa: {
        type: Number
    }
}, {
    collection: "QLTS_Dieu_Chuyen",
    versionKey: false
}
);
module.exports = mongoose.model("QLTS_Dieu_Chuyen", model_Dieuchuyen);