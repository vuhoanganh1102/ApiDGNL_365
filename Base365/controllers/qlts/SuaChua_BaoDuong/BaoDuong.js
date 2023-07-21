const fnc = require('../../../services/functions');
const ThongBao = require('../../../models/QuanLyTaiSan/ThongBao');
const BaoDuong = require('../../../models/QuanLyTaiSan/BaoDuong');
const QuyDinh = require('../../../models/QuanLyTaiSan/Quydinh_bd');
const TheoDoiCongSuat = require('../../../models/QuanLyTaiSan/TheoDoiCongSuat');

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

//lay ra danh sach can bao duong/ dang bao duong/ da bao duong/ quy dinh bao duong/ theo doi cong suat
exports.danhSachBaoDuong = async (req, res, next) => {
  try{
    // $sql_nv .= " AND (bd_id_ng_tao = '".$id_ng_tao."' OR bd_ng_thuchien = '".$id_ng_tao."' OR bd_ng_sd = '".$id_ng_tao."' OR bd_vi_tri_dang_sd = '".$id_ng_tao."')";
    //     $sql_nv1 .= "AND quydinh_bd.id_ng_tao_qd = '".$id_ng_tao."'";
    // $tsbd = new db_query("SELECT * FROM bao_duong WHERE id_cty = '".$com_id."' AND ((xoa_bd = 0 AND bd_trang_thai = 0 ".$sql." ".$sql_nv.") OR (xoa_bd = 0 AND bd_trang_thai = 2 ".$sql." ".$sql_nv.")) ORDER BY id_bd DESC LIMIT $start, $limit");
    // $tsbd2 = new db_query("SELECT * FROM bao_duong WHERE id_cty = '".$com_id."' AND xoa_bd = 0 AND bd_trang_thai = 0 ".$sql." ".$sql_nv." OR xoa_bd = 0 AND bd_trang_thai = 2 ".$sql." ".$sql_nv." ORDER BY id_bd DESC");
    // $dangbd = new db_query("SELECT * FROM bao_duong WHERE id_cty = '".$com_id."' AND xoa_bd = 0 AND bd_trang_thai = 0 ".$sql_nv." ORDER BY id_bd DESC");
    // $q_da_bd = new db_query("SELECT * FROM bao_duong WHERE id_cty = '".$com_id."' AND xoa_bd = 0 AND bd_trang_thai = 1 ".$sql_nv." ORDER BY id_bd DESC");
    // $quydinh = new db_query("SELECT * FROM quydinh_bd INNER JOIN loai_taisan ON quydinh_bd.id_loai = loai_taisan.id_loai INNER JOIN nhom_taisan ON loai_taisan.id_nhom_ts = nhom_taisan.id_nhom WHERE quydinh_bd.id_cty = '".$com_id."' AND qd_xoa = 0 ".$sql_nv1." ORDER BY qd_id DESC");
    // $donvics = new db_query("SELECT * FROM theodoi_congsuat
    // INNER JOIN loai_taisan ON theodoi_congsuat.id_loai = loai_taisan.id_loai 
    // INNER JOIN donvi_cs ON theodoi_congsuat.id_donvi = donvi_cs.id_donvi 
    // WHERE theodoi_congsuat.id_cty = '".$com_id."' AND tdcs_xoa = 0 ORDER BY theodoi_congsuat.id_cs DESC");
    
    let {page, pageSize, key, dataType} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 10;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;

    let com_id = req.com_id;
    let idQLC = req.id;
    let condition = {id_cty: com_id, xoa_bd: 0, 
      $or: [
        {bd_id_ng_tao: idQLC},
        {bd_ng_thuchien: idQLC},
        {bd_ng_sd: idQLC},
        {bd_vi_tri_dang_sd: idQLC}
      ]
    };
    if(key) condition.id_bd = key;
    if(dataType != 1 && dataType != 2 && dataType != 3 && dataType != 4 && dataType != 5) return fnc.setError(res, "Truyen dataType = 1, 2, 3, 4, 5");
    //can bao duong
    if(dataType == 1) {
      condition.bd_trang_thai = {$in: [0, 2]};
    }
    //dang bao duong
    else if(dataType == 2) {
      condition.bd_trang_thai = 0;
    }
    //da bao duong
    else if(dataType == 3) {
      condition.bd_trang_thai = 1;
    }
    //quy dinh
    else if(dataType == 4) {
      let condition2 = {id_cty: com_id, qd_xoa: 0, quydinh_bd: idQLC};
      let quydinh = await fnc.pageFind(QuyDinh, condition2, {qd_id: -1}, skip, pageSize);
      let total = await fnc.findCount(QuyDinh, condition2);
      return fnc.success(res, "Lay ra danh sach bao duong thanh cong", {page, pageSize, total,quydinh});
    }
    //theo doi cong suat
    else if(dataType == 5) {
      let condition2 = {id_cty: com_id, tdcs_xoa: 0};
      let theoDoiCongSuat = await fnc.pageFind(TheoDoiCongSuat, condition2, {id_cs: -1}, skip, pageSize);
      let total = await fnc.findCount(TheoDoiCongSuat, condition2);
      return fnc.success(res, "Lay ra danh sach bao duong thanh cong", {page, pageSize, total,theoDoiCongSuat});
    }

    let listBaoDuong = await fnc.pageFind(BaoDuong, condition, {id_bd: -1}, skip, pageSize);
    const total = await fnc.findCount(BaoDuong, condition);
    return fnc.success(res, "Lay ra danh sach bao duong thanh cong", {page, pageSize, total,listBaoDuong});
  }catch(e){
    return fnc.setError(res, e.message);
  }
}