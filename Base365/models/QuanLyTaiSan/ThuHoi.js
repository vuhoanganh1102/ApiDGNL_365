const mongoose = require("mongoose");
const model_ThuHoi = new mongoose.Schema({
    thuhoi_id: {
        type: Number,
        require: true
    },
    thuhoi_ng_tao: {
        type: Number
    },
    th_type_quyen: {
        type: Number
    },
    thuhoi_taisan: {
        ds_thuhoi: {
          type: [
            {
              ts_id: {
                type: Number
              },
              sl_th: {
                type: Number
              }
            }
          ]
        }
    },
    id_cty: {
        type: Number
    },
    id_ng_thuhoi: {
        type: Number
    },
    id_ng_dc_thuhoi: {
        type: Number
    },
    id_pb_thuhoi: {
        type: Number
    },
    th_dai_dien_pb: {
        tpye: Number
    },
    thuhoi_ngay: {
        type: Number
    },
    thuhoi_hoanthanh: {
        type: Number
    },
    thuhoi_soluong: {
        type: Number
    },
    thuhoi_trangthai: {
        type: Number
    },
    thuhoi__lydo: {
        type: String
    },
    loai_thuhoi: {
        type: Number
    },
    thuhoi_type_quyen: {
        type: String
    },
    thuhoi_id_ng_xoa: {
        type: Number
    },
    xoa_thuhoi: {
        type: Number
    },
    thuhoi_date_create: {
        type: Number
    },
    thuhoi_date_delete: {
        type: Number
    },
    th_ly_do_tu_choi_ban_giao: {
        type: String
    },
    th_ly_do_tu_choi_nhan: {
        type: String
    },
    th_ly_do_tu_choi_thuhoi: {
        type: String
    }
},
    {
        collection: "QLTS_ThuHoi",
        versionKey: false
    });
module.exports = mongoose.model("QLTS_ThuHoi", model_ThuHoi);