const functions = require('../../services/functions');
const KiemKe = require('../../models/QuanLyTaiSan/KiemKe');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const TaiSanDangSD= require('../../models/QuanLyTaiSan/TaiSanDangSuDung');
const QuaTrinhSuDung= require('../../models/QuanLyTaiSan/QuaTrinhSuDung');

exports.getAndCheckData = async(req, res, next) => {
  try{
    let {ky_1, ky_2, loai_kk, taisan_kk, ng_kk, vitrits, noidung, denngay, day_start, day_end} = req.body;
    //kiem tra dinh dang ngay
    if(!ky_1 || !ky_2 || !loai_kk || !taisan_kk || !denngay || !day_start || !day_end) {
      return functions.setError(res, "Missing input value!", 404);
    }
    if(!await functions.checkDate(denngay) || !await functions.checkDate(day_start) || !await functions.checkDate(day_end)){
      return functions.setError(res, "Ngay khong dung dinh dang!", 405);
    }
    let comId = req.user.data.com_id;
    let id = req.user.data.idQLC;
    let type = req.user.data.type;

    let ky_kk;
    if(ky_1<=12) ky_kk = `01-${ky_1}-${ky_2}`;
    else if(ky_1==13) ky_kk  = `01-01-${ky_2}`;
    else if(ky_1==14) ky_kk  = `01-04-${ky_2}`;
    else if(ky_1==15) ky_kk  = `01-07-${ky_2}`;
    else if(ky_1==16) ky_kk  = `01-10-${ky_2}`;

    let kk_date_create = functions.convertTimestamp(Date.now());
    ky_kk = functions.convertTimestamp(ky_kk); 
    denngay = functions.convertTimestamp(denngay);
    day_start = functions.convertTimestamp(day_start);
    day_end = functions.convertTimestamp(day_end);
    let fieldsKK = {
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
    let fieldsTB = {
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
      req.fieldsKK = fieldsKK;
      req.fieldsTB = fieldsTB;
      return next();
  }catch(error) {
    return functions.setError(res, error.message, 500);
  }
}

exports.create = async(req, res, next)=>{
  try{
    let fieldsKK = req.fieldsKK;
    let maxIdKK = await functions.getMaxIdByField(KiemKe, 'id_kiemke');
    fieldsKK.id_kiemke = maxIdKK;
    
    let kiemKe = new KiemKe(fieldsKK);
    kiemKe = await kiemKe.save();
    if(kiemKe) {
      let maxIdThongBao = await functions.getMaxIdByField(ThongBao, 'id_tb');
      let fieldsTB = req.fieldsTB;
      fieldsTB.id_tb =  maxIdThongBao;
      fieldsTB.id_ts = maxIdKK;
      let thongBao = new ThongBao(fieldsTB);
      thongBao = await thongBao.save();
      if(thongBao) {
        return functions.success(res, "Create kiem ke success!");
      }
      return functions.setError(res, "Create thong bao fail!", 505);
    }
    return functions.setError(res, "Create kiem ke fail!", 505);
  }catch(error) {
    return functions.setError(res, error.message, 500);
  }
}

exports.update = async(req, res, next)=>{
  try{
    let id_kk = req.body.id_kk;
    if(id_kk) {
      let fieldsKK = req.fieldsKK;
      const comId = req.user.data.com_id;
      let kiemKe = await KiemKe.findOneAndUpdate({id_kiemke: id_kk, id_cty: comId}, fieldsKK, {new: true});
      if(kiemKe) {
        return functions.success(res, "Update kiem ke success!", {kiemKe: kiemKe});
      }
      return functions.setError(res, "Kiem ke not found!", 505);
    }
    return functions.setError(res, "Missing input id_kk!", 403);
  }catch(error) {
    return functions.setError(res, error.message, 500);
  }
}

exports.danhSachKiemKe = async(req, res, next)=>{
  try{
    let {page, pageSize, key} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 20;
    page = Number(page);
    pageSize = Number(pageSize);
    const limit = pageSize;
    const skip = (page-1)*limit;
    const comId = req.user.data.com_id;

    let condition = {id_cty: comId, xoa_kiem_ke: 0};
    if(key) {
      if(!isNaN(parseFloat(key)) && isFinite(key)) condition.id_kiemke = key;
      else condition.kk_noidung = new RegExp(key, 'i');
    }
    
    // let danhSachKiemKe = await functions.pageFind(KiemKe, condition, {id_kiemke: -1}, skip, limit);
    let danhSachKiemKe = await KiemKe.aggregate([
      {$match: condition},
      {
          $lookup: {
              from: 'Users',
              localField: 'id_ng_kiemke',
              foreignField: 'idQLC',
              as: 'user',
          }
      },
      {$sort: {id_kiemke: -1}},
      {$skip: skip},
      {$limit: limit}
      ]);
  let total = await functions.findCount(KiemKe, condition);
    return functions.success(res, "Danh sach kiem ke:", {total: total, danhSachKiemKe: danhSachKiemKe});
  }catch(error) {
    return functions.setError(res, error.message, 500);
  }
}

exports.delete = async(req, res, next) => {
  try{
    const {id_kk, datatype} = req.body;
    const userId = req.user.data.idQLC;
    const comId = req.user.data.com_id;
    const type = req.user.data.type;
    const time = functions.convertTimestamp(Date.now());
    
    if(!id_kk){
      return functions.setError(res, "Missing input id_kk", 404);
    }
    if(datatype!=1 && datatype!=2 && datatype!=3) {
      return functions.setError(res, "Vui long truyen datatype = 1/2/3", 404);
    }
    //
    if(datatype==1) {
      let kiemKe = await KiemKe.findOneAndUpdate({id_kiemke: id_kk, id_cty: comId}, {
        xoa_kiem_ke: 1,
        kk_type_quyen: type,
        kk_id_ng_xoa: userId,
        kk_date_delete: time,
      }, {new: true});
      if(kiemKe) return functions.success(res, "Xoa tam thoi kiem ke thanh cong!");
    }
    else if(datatype==2) {
      let kiemKe = await KiemKe.findOneAndUpdate({id_kiemke: id_kk, id_cty: comId},{
        xoa_kiem_ke: 0,
        kk_type_quyen: 0,
        kk_id_ng_xoa: 0,
        kk_date_delete: 0,
      }, {new: true});
      if(kiemKe) return functions.success(res, "Khoi phuc kiem ke thanh cong!");
    }
    else if(datatype==3) {
      let kiemKe = await KiemKe.findOneAndDelete({id_kiemke: id_kk, id_cty: comId});
      if(kiemKe) return functions.success(res, "Xoa vinh vien kiem ke thanh cong!");
    }
    return functions.setError(res, "Kiem ke not found!", 505);
  }catch(error){
    return functions.setError(res, error.message, 500);
  }
}

exports.deleteMany = async(req, res, next) => {
  try{
    const {array_xoa, datatype} = req.body;
    const userId = req.user.data.idQLC;
    const comId = req.user.data.com_id;
    const type = req.user.data.type;
    const time = functions.convertTimestamp(Date.now());
    
    if(!array_xoa){
      return functions.setError(res, "Missing input array_xoa", 404);
    }
    if(datatype!=1 && datatype!=2 && datatype!=3) {
      return functions.setError(res, "Vui long truyen datatype = 1/2/3", 404);
    }
    //
    if(datatype==1) {
      for(let i=0; i<array_xoa.length; i++) {
        let kiemKe = await KiemKe.findOneAndUpdate({id_kiemke: array_xoa[i], id_cty: comId}, {
          xoa_kiem_ke: 1,
          kk_type_quyen: type,
          kk_id_ng_xoa: userId,
          kk_date_delete: time,
        }, {new: true});
      }
      return functions.success(res, "Xoa tam thoi kiem ke thanh cong!");
    }
    else if(datatype==2) {
      for(let i=0; i<array_xoa.length; i++) {
        let kiemKe = await KiemKe.findOneAndUpdate({id_kiemke: array_xoa[i], id_cty: comId},{
          xoa_kiem_ke: 0,
          kk_type_quyen: 0,
          kk_id_ng_xoa: 0,
          kk_date_delete: 0,
        }, {new: true});
      }
      return functions.success(res, "Khoi phuc kiem ke thanh cong!");
    }
    else if(datatype==3) {
      for(let i=0; i<array_xoa.length; i++) {
        let kiemKe = await KiemKe.findOneAndDelete({id_kiemke: array_xoa[i], id_cty: comId});
      }
      return functions.success(res, "Xoa vinh vien kiem ke thanh cong!");
    }
    return functions.setError(res, "Xoa nhieu that bai!", 505);
  }catch(error){
    return functions.setError(res, error.message, 500);
  }
}

exports.duyet = async(req, res, next) => {
  try{
    const id_kk = req.body.id_kk;
    const ng_duyet = req.user.data.idQLC;
    const type = req.user.data.type;
    const comId = req.user.data.com_id;
    const time = functions.convertTimestamp(Date.now());
    let kiemKe = await KiemKe.findOneAndUpdate({id_kiemke: id_kk, id_cty: comId}, {
      id_ngduyet_kk: ng_duyet,
      kk_ngayduyet: time,
      kk_type_quyen_duyet: type,
      kk_tiendo: 100,
      kk_trangthai: 3
    }, {new: true});
    if(kiemKe) return functions.success(res, "Duyet kiem ke thanh cong!");
    return functions.setError(res, "Kiem ke not found!", 504);
  }catch(error){
    return functions.setError(res, error.message, 500);
  }
}

exports.chiTiet = async(req, res, next) => {
  try{
    const id_kk = req.body.id_kk;
    const com_id = req.user.data.com_id;
    if(!id_kk) return functions.setError(res, "Missing input id_kk!", 404);
    let kiemKe = await KiemKe.findOne({id_kiemke: id_kk}).lean();
    let danhSachTaiSan = [];
    
    if(kiemKe) {
      let quaTrinhSD = await QuaTrinhSuDung.find( {id_cty: com_id});
      let tsDangSD  = await TaiSanDangSD.find({com_id_sd: com_id});
      if(kiemKe.id_ts && kiemKe.id_ts.ds_ts) {
        let id_ts = kiemKe.id_ts.ds_ts;
        for(let i=0; i<id_ts.length; i++) {
          let id_tai_san = id_ts[i];
          let ts_detail = {
            ts_so_luong: 0,
            ts_dang_sd: 0,
            ts_huy: 0,
          };

          //tong so luong
          let taiSan = await TaiSan.findOne({ts_id: id_ts[i], id_cty: com_id});
          if(taiSan) ts_detail["ts_so_luong"] = taiSan.ts_so_luong;
          
          //loc ra tai san dang su dung
          const sl_dang_sd = tsDangSD.reduce((sum, item) => {
            if (item.id_ts_sd === id_tai_san) {
              return sum + parseInt(item.sl_dang_sd);
            }
            return sum;
          }, 0);
          ts_detail["ts_dang_sd"] = sl_dang_sd;

          //so luong tai san hong
          const sl_huy = quaTrinhSD.reduce((sum, item) => {
            if (
              item.id_ts === id_tai_san &&
              item.qt_nghiep_vu === 7
            ) {
              return sum + parseInt(item.so_lg);
            }
            return sum;
          }, 0);
          ts_detail["ts_huy"] = sl_huy;

          //so luong tai san thanh ly
          const sl_thanhly = quaTrinhSD.reduce((sum, item) => {
            if (
              item.id_ts === id_tai_san &&
              item.qt_nghiep_vu === 8
            ) {
              return sum + parseInt(item.so_lg);
            }
            return sum;
          }, 0);
          ts_detail["ts_thanhly"] = sl_thanhly;

          //so luong tai san mat
          const sl_mat = quaTrinhSD.reduce((sum, item) => {
            if (
              item.id_ts === id_tai_san &&
              item.qt_nghiep_vu === 6
            ) {
              return sum + parseInt(item.so_lg);
            }
            return sum;
          }, 0);
          ts_detail["ts_mat"] = sl_mat;

          //so luong tai san sua chua
          const sl_suachua = quaTrinhSD.reduce((sum, item) => {
            if (
              item.id_ts === id_tai_san &&
              item.qt_nghiep_vu === 4
            ) {
              return sum + parseInt(item.so_lg);
            }
            return sum;
          }, 0);
          ts_detail["ts_suachua"] = sl_suachua;

          danhSachTaiSan.push(ts_detail);
        }
        kiemKe.danhSachTaiSan = danhSachTaiSan;
      }

      return functions.success(res, "Lay thong tin chi tiet kiem ke thanh cong!", {kiemKe: kiemKe});
    }
    return functions.setError(res, "Kiem ke not found!", 504);
  }catch(error){
    return functions.setError(res, error.message, 500);
  }
}