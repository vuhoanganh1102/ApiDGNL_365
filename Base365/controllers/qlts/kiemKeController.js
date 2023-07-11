const functions = require('../../services/functions');
const KiemKe = require('../../models/QuanLyTaiSan/KiemKe');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');

exports.create = async(req, res, next)=>{
  try{
    let {ky_1, ky_2, loai_kk, taisan_kk, ng_kk, vitrits, noidung, denngay, day_start, day_end} = req.body;
    
    if(ky_1 && ky_2 && loai_kk && taisan_kk && denngay && day_start && day_end) {
      let ky_kk;
      if(ky_1<=12) ky_kk = `01-${ky_1}-${ky_2}`;
      else if(ky_1==13) ky_kk  = `01-01-${ky_2}`;
      else if(ky_1==14) ky_kk  = `01-04-${ky_2}`;
      else if(ky_1==15) ky_kk  = `01-07-${ky_2}`;
      else if(ky_1==16) ky_kk  = `01-10-${ky_2}`;
      let maxId = await functions.getMaxIdByField(KiemKe, 'id_kiemke');
      let comId = req.comId;
      let id = req.userId;
      let type = req.type;
      let kk_date_create = functions.convertTimestamp(Date.now());
      ky_kk = functions.convertTimestamp(ky_kk); 
      denngay = functions.convertTimestamp(denngay);
      day_start = functions.convertTimestamp(day_start);
      day_end = functions.convertTimestamp(day_end);
      let fields = {
        id_kiemke: maxId,
        id_cty: comId,
        "id_ts.ds_ts": taisan_kk,
        id_ngtao_kk: id,
        id_ng_kiemke: ng_kk,
        kk_loai: loai_kk,
        kk_loai_time: ky_1,
        kk_noidung: noidung,
        kk_ky: ky_kk,
        kk_denngay: denngay,
        kk_donvi: comId,
        kk_batdau: day_start,
        kk_ketthuc: day_end,
        kk_trangthai: 0,
        kk_tiendo: 0,
        kk_type_quyen: type,
        xoa_kiem_ke: 0,
        kk_date_create: kk_date_create,
      }
      let kiemKe = new KiemKe(fields);
      kiemKe = await kiemKe.save();
      if(kiemKe) {
        // id_ts,id_cty,id_ng_nhan, id_ng_tao, type_quyen,type_quyen_tao,loai_tb, add_or_duyet,da_xem,date_create) VALUES 
        // ('$last_id','$id_cty','$ng_kk','$id_ng_tao','2','$type_quyen','12','1','0','$date_create')"
        let fieldsTB = {
          id_ts: maxId,
          id_cty: comId,
          id_ng_nhan: ng_kk,
          id_ng_tao: id,
          type_quyen: 2,
          type_quyen_tao: type,
          loai_tb: 12,
          add_or_duyet: 1,
          da_xem: 0,
          date_create: kk_date_create
        }
        let thongBao = new ThongBao(fields);
        thongBao = await thongBao.save();
        if(!thongBao) {
          return functions.setError(res, "Create thong bao fail!", 505);
        }
        return functions.success(res, "create kiem ke success!", maxId);
      }
      return functions.setError(res, "Create kiem ke fail!", 504);
    }
    return functions.setError(res, "Missing input value!", 404);
  }catch(error) {
    return functions.setError(res, error.message, 500);
  }
}