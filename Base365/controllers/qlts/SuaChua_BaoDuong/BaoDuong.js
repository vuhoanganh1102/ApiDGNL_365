// const fnc = require('../../../services/functions');
// const ThongBao = require('../../../models/QuanLyTaiSan/ThongBao');
// const BaoDuong = require('../../../models/QuanLyTaiSan/BaoDuong');

// exports.addBaoDuong = async (req, res) => {
//     try {
//         let { id_ts, sl_bd, trang_thai_bd, cs_bd, type_quyen, ngay_bd, ngay_dukien_ht, ngay_ht_bd, chiphi_dukien, chiphi_thucte,
//             nd_bd, ng_thuc_hien, dia_diem_bd, quyen_ng_sd, ng_sd, vitri_ts, dv_bd, dia_chi_nha_cung_cap } = req.body;
//         let com_id = 0;
//         let id_ng_tao = 0;
//         if (req.user.data.type == 1) {
//             com_id = req.user.data.idQLC;
//             id_ng_tao = req.user.data.idQLC;

//         } else if (req.user.data.type == 2) {
//             com_id = req.user.data.com_id;
//             id_ng_tao = req.user.data.idQLC;
//         }

//         let date_create = new Date().getTime();
//         let maxIDTb = 0;
//         let Tb = await ThongBao.findOne({}, {}, { sort: { id_tb: -1 } });
//         if (Tb) {
//             maxIDTb = Tb.id_tb;
//         }
//         let insert_thongbao = await ThongBao.findOneAndUpdate({
//             id_tb: maxIDTb + 1,
//             id_cty: com_id,
//             id_ng_nhan: com_id,
//             id_ng_tao: id_ng_tao,
//             type_quyen: 2,
//             type_quyen_tao: type_quyen,
//             loai_tb: 5,
//             add_or_duyet: 1,
//             da_xem: 0,
//             date_create: date_create
//         });
//         let maxIDBD = 0;
//         let BD = await BaoDuong.findOne({}, {}, { sort: { id_tb: -1 } });
//         if (BD) {
//             maxIDBD = BD.id_bd;
//         }
//         let insert_taisan = await BaoDuong.findOneAndUpdate({
//             id_bd : maxIDBD+ 1 ,
//             baoduong_taisan:id_ts,
//             bd_sl: sl_bd,
//             id_cty: com_id ,
//             bd_tai_congsuat: cs_bd,
//             bd_trang_thai: trang_thai_bd,
//             bd_ngay_batdau: ngay_bd,
//             bd_dukien_ht: ngay_dukien_ht,
//             bd_ngay_ht: ngay_ht_bd,
//             bd_noi_dung: nd_bd,
//             bd_chiphi_dukien: chiphi_dukien,
//             bd_chiphi_thucte: chiphi_thucte

//         })


//     } catch (error) {
//         console.log(error);
//         fnc.setError(res, "loi he thong");


//     }
// }