const Users = require('../../models/Users');
const JobCategory = require('../../models/ViecLamTheoGio/JobCategory');
const UvCvmm = require('../../models/ViecLamTheoGio/UvCvmm');
const UvKnlv = require('../../models/ViecLamTheoGio/UvKnlv');
const ViecLam = require('../../models/ViecLamTheoGio/ViecLam');
const UngTuyen = require('../../models/ViecLamTheoGio/UngTuyen');
const UvSaveVl = require('../../models/ViecLamTheoGio/UvSaveVl');
const functions = require('../../services/functions');

//danh sach nganh nghe
exports.danhSachNganhNghe = async(req, res, next) => {
  try{
    let total = await functions.findCount(JobCategory, {jc_active: 1});
    let data = await JobCategory.find({jc_active: 1}).sort({jc_order: -1});
    return functions.success(res, "danh sach nganh nghe", {total, data});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//-----------------cong viec mong muon
exports.getCongViecMongMuon = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let uvCvmm = await UvCvmm.findOne({id_uv_cvmm: userId});
    return functions.success(res, "get info cong viec mong muon thanh cong", {data: uvCvmm});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateCongViecMongMuon = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let {cong_viec, nganh_nghe, dia_diem, cap_bac, hinh_thuc, luong} = req.body;
    if(cong_viec && nganh_nghe && dia_diem && cap_bac && hinh_thuc && luong && dia_diem.length>0 && nganh_nghe.length>0) {
      nganh_nghe = nganh_nghe.join(", ");
      dia_diem = dia_diem.join(", ");
      let uvCvmm = await UvCvmm.findOneAndUpdate({id_uv_cvmm: userId}, {
        cong_viec: cong_viec,
        nganh_nghe: nganh_nghe,
        dia_diem: dia_diem,
        lever: cap_bac,
        hinh_thuc: hinh_thuc,
        luong: luong,
      }, {new: true, upsert: true});
      if(uvCvmm) {
        return functions.success(res, "Update cvmm success!", {uvCvmm});
      }
      return functions.setError(res, "Update cvmm fail!", 406);
    }
    return functions.setError(res, "Missing input value!", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateKyNangBanThan = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let ky_nang = req.body.ky_nang;
    let uvCvmm = await UvCvmm.findOneAndUpdate({id_uv_cvmm: userId}, {
        ky_nang: ky_nang,
      }, {new: true, upsert: true});
      if(uvCvmm) {
        return functions.success(res, "Update cvmm success!", {uvCvmm});
      }
      return functions.setError(res, "Update cvmm fail!", 406);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//-------------kinh nghiem lam viec
exports.getKinhNghiemLamViec = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let uvKnlv = await UvKnlv.find({id_uv_knlv: userId}).sort({id_knlv: 1});
    return functions.success(res, "get info kinh nghiem lam viec thanh cong", {data: uvKnlv});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.createKinhNghiemLamViec = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let {chucdanh, time_fist, time_end, cty, mota} = req.body;
    let now = Date.now();
    if(chucdanh && time_fist && time_end && cty && mota) {
      if(functions.checkDate(time_fist) && functions.checkDate(time_end)) {
        time_fist = new Date(time_fist);
        time_end = new Date(time_end);
        if(time_fist<now && time_end<now && time_end>time_fist) {
          let idMax = await functions.getMaxIdByField(UvKnlv, 'id_knlv');
          let knlv = new UvKnlv({
            id_knlv: idMax,
            id_uv_knlv: userId,
            chuc_danh: chucdanh,
            time_fist: time_fist,
            time_end: time_end,
            cty_name: cty,
            mota: mota
          });
          knlv = knlv.save();
          if(knlv) {
            return functions.success(res, "create kinh nghiem lam viec success!");
          }
          return functions.setError(res, "create kinh nghiem lam viec fail", 408);
        }
        return functions.setError(res, "time_end > now or time_fist > now or time_end<time_fist", 407);
      }
      return functions.setError(res, "invalid date", 406);
    }
    return functions.setError(res, "Missing input value", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateKinhNghiemLamViec = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let {id_knlv, chucdanh, time_fist, time_end, cty, mota} = req.body;
    let now = Date.now();
    if(id_knlv && chucdanh && time_fist && time_end && cty && mota) {
      if(functions.checkDate(time_fist) && functions.checkDate(time_end)) {
        time_fist = new Date(time_fist);
        time_end = new Date(time_end);
        if(time_fist<now && time_end<now && time_end>time_fist) {
          let knlv = await UvKnlv.findOneAndUpdate({id_knlv: Number(id_knlv), id_uv_knlv: userId}, {
            chuc_danh: chucdanh,
            time_fist: time_fist,
            time_end: time_end,
            cty_name: cty,
            mota: mota
          }, {new: true});
          if(knlv) {
            return functions.success(res, "update kinh nghiem lam viec success!");
          }
          return functions.setError(res, "kinh nghiem lam viec not found!", 408);
        }
        return functions.setError(res, "time_end > now or time_fist > now or time_end<time_fist", 407);
      }
      return functions.setError(res, "invalid date", 406);
    }
    return functions.setError(res, "Missing input value", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.deleteKinhNghiemLamViec = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let id_knlv = req.body.id_knlv;
    if(id_knlv) {
      let uvKnlv = await UvKnlv.findOneAndDelete({id_knlv: Number(id_knlv), id_uv_knlv: userId});
      if(uvKnlv) {
        return functions.success(res, "xoa kinh nghiem lam viec thanh cong");
      }
      return functions.setError(res, "Kinh nghiem lam viec not found", 404);
    }
    return functions.setError(res, "Missing input id_knlv", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//---------------Buoi co the di lam
exports.getBuoiCoTheDiLam = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let user_uv = await Users.findOne({idVLTG: userId}, {
      "userName": "$userName",
      "phone": "$phone",
      "phoneTK": "$phoneTK",
      "email": "$email",
      "city": "$city",
      "district": "$district",
      "address": "$address",
      "gender": "$inForPerson.gender",
      "married": "$inForPerson.married",
      "birthday": "$inForPerson.birthday",
      "uv_day": "$inforVLTG.uv_day",
      "luot_xem": "$inforVLTG.luot_xem"
    });
    if(user_uv) {
      return functions.success(res, "get info ung vien thanh cong", {data: user_uv});
    }
    return functions.setError(res, "ung vien not fund!", 404);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.updateBuoiCoTheDiLam = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let day = req.body.day;
    if(day && day.length>0) {
      day = day.join(", ");
      let user_uv = await Users.findOneAndUpdate({idVLTG: userId}, {
        inforVLTG: {
          uv_day: day,
        }
      }, {new: true});
      if(user_uv) {
        return functions.success(res, "update ung vien thanh cong");
      }
      return functions.setError(res, "ung vien not fund!", 404);
    }
    return functions.setError(res, "Missing input day!", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//----viec lam da ung tuyen
exports.getViecLamDaUngTuyen = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let {page, pageSize} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 6;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;

    let listViecLam = await UngTuyen.aggregate([
      {$match: {id_uv: userId}},
      {$sort: {id_ungtuyen: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "VLTG_ViecLam",
            localField: "id_viec",
            foreignField: "id_vieclam",
            as: "ViecLam"
        }
      },
      {$unwind: { path: "$ViecLam", preserveNullAndEmptyArrays: true }},
      {
        $project: {
            "id_ungtuyen": "$id_ungtuyen",
            "id_uv": "$id_uv",
            "id_ntd": "$id_ntd",
            "id_viec": "$id_viec",
            "ca_lam": "$ca_lam",
            "gio_lam": "$gio_lam",
            "day": "$day",
            "ghi_chu": "$ghi_chu",
            "status": "$status",
            "created_at": "$created_at",
            "alias": "$ViecLam.alias",
            "vi_tri": "$ViecLam.vi_tri",
            "muc_luong": "$ViecLam.muc_luong",
            "tra_luong": "$ViecLam.tra_luong",
            "fist_time": "$ViecLam.fist_time",
            "last_time": "$ViecLam.last_time",
        }
      }
    ]);

    let total = await functions.findCount(UngTuyen, {id_uv: userId});
    return functions.success(res, "get danh sach viec lam da ung tuyen thanh cong", {total: total, data: listViecLam});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.deleteViecLamDaUngTuyen = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let id_viec = req.body.id_viec;
    if(id_viec) {
      let ungTuyen = await UngTuyen.findOneAndDelete({id_uv: userId, id_viec: Number(id_viec)});
      if(ungTuyen) {
        return functions.success(res, "Delete viec lam da ung tuyen thanh cong!");
      }
      return functions.setError(res, "Viec lam da ung tuyen not found", 405);
    }
    return functions.setError(res, "Missing input id_viec", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//-------------Viec lam da luu
exports.getViecLamDaLuu = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let {page, pageSize} = req.body;
    if(!page) page = 1;
    if(!pageSize) pageSize = 6;
    page = Number(page);
    pageSize = Number(pageSize);
    const skip = (page-1)*pageSize;

    let listViecLam = await UvSaveVl.aggregate([
      {$match: {id_uv: userId}},
      {$sort: {id: -1}},
      {$skip: skip},
      {$limit: pageSize},
      {
        $lookup: {
            from: "VLTG_ViecLam",
            localField: "id_viec",
            foreignField: "id_vieclam",
            as: "ViecLam"
        }
      },
      {$unwind: { path: "$ViecLam", preserveNullAndEmptyArrays: true }},
      {
        $project: {
            "id": "$id",
            "id_uv": "$id_uv",
            "id_viec": "$id_viec",
            "ntd_name": "$ntd_name",
            "created_at": "$created_at",
            "alias": "$ViecLam.alias",
            "vi_tri": "$ViecLam.vi_tri",
            "muc_luong": "$ViecLam.muc_luong",
            "tra_luong": "$ViecLam.tra_luong",
            "fist_time": "$ViecLam.fist_time",
            "last_time": "$ViecLam.last_time",
        }
      }
    ]);

    let total = await functions.findCount(UvSaveVl, {id_uv: userId});
    return functions.success(res, "get danh sach viec lam da ung tuyen thanh cong", {total: total, data: listViecLam});
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.deleteViecLamDaLuu = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let id_viec = req.body.id_viec;
    if(id_viec) {
      let viecLamDaLuu = await UvSaveVl.findOneAndDelete({id_uv: userId, id_viec: Number(id_viec)});
      if(viecLamDaLuu) {
        return functions.success(res, "Delete viec lam da luu thanh cong!");
      }
      return functions.setError(res, "Viec lam da luu not found", 405);
    }
    return functions.setError(res, "Missing input id_viec", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

//--------------cac chuc nang lien quan
exports.nhanViec = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let {id_viec, ca_lam, gio_lam, day} = req.body;
    if(id_viec && ca_lam && gio_lam && day && day.length>0) {
      let viecLam = await ViecLam.findOne({id_vieclam: Number(id_viec)});
      if(viecLam) {
        let idMax = await functions.getMaxIdByField(UngTuyen, 'id_ungtuyen');
        day = day.join(" ");
        let nhanViec = new UngTuyen({
          id_ungtuyen: idMax,
          id_uv: userId,
          id_ntd: viecLam.id_ntd,
          id_viec: id_viec,
          ca_lam: ca_lam,
          gio_lam: gio_lam,
          day: day,
          ghi_chu: "",
          status: 1,
          created_at: Date.now(),
        });
        nhanViec = nhanViec.save();
        if(nhanViec) {
          return functions.success(res, "Ung tuyen viec lam thanh cong!");
        }
        return functions.setError(res, "Ung tuyen viec lam fail", 407);
      }
      return functions.setError(res, "Viec lam not found!", 406);
    }
    return functions.setError(res, "Missing input value", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}

exports.luuViecLam = async(req, res, next) => {
  try{
    let userId = req.user.data.idVLTG;
    let id_viec = req.body.id_viec;
    if(id_viec) {
      let viecLam = await ViecLam.findOne({id_vieclam: Number(id_viec)});
      if(viecLam) {
        let ntd = await Users.findOne({idVLTG: viecLam.id_ntd}, {userName: 1});
        if(ntd) {
          let idMax = await functions.getMaxIdByField(UvSaveVl, 'id');
          let luuViecLam = new UvSaveVl({
            id: idMax,
            id_uv: userId,
            id_viec: id_viec,
            ntd_name: ntd.userName,
            created_at: Date.now(),
          });
          luuViecLam = luuViecLam.save();
          if(luuViecLam) {
            return functions.success(res, "Luu viec lam thanh cong!");
          }
          return functions.setError(res, "Luu viec lam fail", 408);
        }
        return functions.setError(res, "Nha tuyen dung not found!", 407);
      }
      return functions.setError(res, "Viec lam not found!", 406);
    }
    return functions.setError(res, "Missing input value", 405);
  }catch(error) {
    return functions.setError(res, error.message);
  }
}