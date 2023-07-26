
const phanQuyen = require('../../models/QuanLyTaiSan/PhanQuyen');
const Users = require('../../models/Users');
const department = require('../../models/qlc/Deparment')
const functions = require('../../services/functions')

exports.getMaxIDTSVT = async (model) => {
  const maxTSVT = await model.findOne({}, {}, { sort: { tsvt_id: -1 } }).lean() || 0;
  return maxTSVT.tsvt_id;
};

exports.getMaxIDnhom = async (model) => {
  const maxNhom = await model.findOne({}, {}, { sort: { id_nhom: -1 } }).lean() || 0;
  return maxNhom.id_nhom;
};

exports.getMaxID = async (model) => {
  const maxTs = await model.findOne({}, {}, { sort: { ts_id: -1 } }).lean() || 0;
  return maxTs.ts_id;
};
exports.getMaxIDloai = async (model) => {
  const maxlts = await model.findOne({}, {}, { sort: { id_loai: -1 } }).lean() || 0;
  return maxlts.id_loai;
};

exports.getMaxIDVT = async (model) => {
  const maxVt = await model.findOne({}, {}, { sort: { id_vitri: -1 } }).lean() || 0;
  return maxVt.id_vitri;
};


exports.validateTaiSanInput = (ts_ten, ts_don_vi, id_dv_quanly, id_ten_quanly, id_loai_ts, ts_vi_tri) => {
  if (!ts_ten) {
    throw { code: 400, message: 'Tên tài sản bắt buộc.' };
  }
  if(!ts_ten.trim()){
    throw { code: 400, message: 'tên tài sản không được bỏ trống' };
  }
  else if (!ts_don_vi) {
    throw { code: 400, message: "đơn vị tính không không được bỏ trống" }
  }
  else if (!id_dv_quanly) {
    throw { code: 400, message: "id_dv_quanly không không được bỏ trống" }
  }
  else if (!id_ten_quanly) {
    throw { code: 400, message: "id_ten_quanly không không được bỏ trống" }
  }
  else if (!id_loai_ts) {
    throw { code: 400, message: "id_loai_ts không không được bỏ trống" }
  }
  else if (!ts_vi_tri) {
    throw { code: 400, message: "ts_vi_tri không không được bỏ trống" }
  }
  return true;
};

exports.validateinputEdit = (ts_ten, ts_don_vi, id_dv_quanly, id_ten_quanly, id_loai_ts, ts_vi_tri, ts_so_luong, ts_gia_tri, ts_trangthai) => {
  if (!ts_ten) {
    throw { code: 400, message: 'Tên tài sản bắt buộc.' };
  }
  if(!ts_ten.trim()){
    throw { code: 400, message: 'tên tài sản không được bỏ trống' };
  }
  else if (!ts_don_vi) {
    throw { code: 400, message: "đơn vị tính không không được bỏ trống" }
  }
  else if (!id_dv_quanly) {
    throw { code: 400, message: "id_dv_quanly không không được bỏ trống" }
  }
  else if (!id_ten_quanly) {
    throw { code: 400, message: "id_ten_quanly không không được bỏ trống" }
  }
  else if (!id_loai_ts) {
    throw { code: 400, message: "id_loai_ts không không được bỏ trống" }
  }
  else if (!ts_vi_tri) {
    throw { code: 400, message: "ts_vi_tri không không được bỏ trống" }
  }
  else if (!ts_so_luong) {
    throw { code: 400, message: "số lượng không không được bỏ trống" }
  }
  else if (!ts_gia_tri) {
    throw { code: 400, message: "giá trị không không được bỏ trống" }
  }
  else if (!ts_trangthai) {
    throw { code: 400, message: "tình trạng không không được bỏ trống" }
  }
  return true;
};




exports.getDatafindOneAndUpdate = async (model, condition, projection) => {
  return model.findOneAndUpdate(condition, projection);
};

exports.checkRole = (page, role) => {
  return async (req, res, next) => {
    if (req.user.data.type !== 1) {
      if (req.user.data.idQLC && req.user.data.com_id) {
        const data = await phanQuyen.findOne({ id_cty: req.user.data.com_id, id_user: req.user.data.idQLC })
        if (data) {
          if (page === "TS") {
            let TS = data.ds_ts.split(",").map(Number)
            if (TS.includes(role)) {
              req.comId = req.user.data.com_id;
              req.emId = req.user.data.idQLC;
              req.type = 2;
              return next()
            }
          } else if (page === "CP_TH") {
            let CP_TH = data.capphat_thuhoi.split(",").map(Number)
            if (CP_TH.includes(role)) {
              req.comId = req.user.data.com_id;
              req.emId = req.user.data.idQLC;
              req.type = 2;
              return next()
            }
          } else if (page === "DC_BG") {
            let DC_BG = data.dieuchuyen_bangiao.split(",").map(Number)
            if (DC_BG.includes(role)) {
              req.comId = req.user.data.com_id;
              req.emId = req.user.data.idQLC;
              req.type = 2;
              return next()
            }
          } else if (page === "SC_BD") {
            let SC_BD = data.suachua_baoduong.split(",").map(Number)
            if (SC_BD.includes(role)) {
              req.comId = req.user.data.com_id;
              req.emId = req.user.data.idQLC;
              req.type = 2;
              return next()
            }
          } else if (page === "M_H_TL") {
            let M_H_TL = data.mat_huy_tl.split(",").map(Number)
            if (M_H_TL.includes(role)) {
              req.comId = req.user.data.com_id;
              req.emId = req.user.data.idQLC;
              req.type = 2;
              return next()
            }
          } else if (page === "PQ") {
            let PQ = data.phan_quyen.split(",").map(Number)
            if (PQ.includes(role)) {
              req.comId = req.user.data.com_id;
              req.emId = req.user.data.idQLC;
              req.type = 2;
              return next()
            }
          } else if (page === "none") {
            req.comId = req.user.data.com_id;
            req.emId = req.user.data.idQLC;
            req.type = 2;
            return next()
          } else {
            return res.status(405).json({ message: "user need permision" })
          }
        }
        return res.status(405).json({ message: "user need permision" })
      }
      return res.status(405).json({ message: "Missing info User" })
    } else {
      req.comId = req.user.data.com_id;
      req.type = 1;
      return next()
    }
  }
}
exports.numberWithCommas = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
exports.getDataFromToken = async (req, res, next) => {
  let user = req.user;
  if (!user.data || !user.data.type || !user.data.idQLC || !user.data.userName) {
    return res.status(404).json({ message: "Token missing info!" });
  }
  var infoLogin = { type: user.data.type, role: user.data.role, id: user.data.idQLC, name: user.data.userName };
  if (user.data.type != 1) {
    if (user.data.inForPerson && user.data.inForPerson.employee && user.data.inForPerson.employee.com_id) {
      infoLogin.comId = user.data.inForPerson.employee.com_id;
    } else {
      return res.status(405).json({ message: "Missing info inForPerson!" });
    }
  } else {
    infoLogin.comId = user.data.idQLC;
  }
  req.id = infoLogin.id;
  req.com_id = infoLogin.comId;
  req.userName = infoLogin.name;
  req.type = infoLogin.type;
  req.role = infoLogin.role;
  req.infoLogin = infoLogin;
  next();
}

exports.getLinkFile = (folder, time, fileName) => {
  let date = new Date(time * 1000);
  const y = date.getFullYear();
  const m = ('0' + (date.getMonth() + 1)).slice(-2);
  const d = ('0' + date.getDate()).slice(-2);
  let link = process.env.DOMAIN_VAN_THU + `/base365/qlts/uploads/${folder}/${y}/${m}/${d}/`;
  let res = '';

  let arrFile = fileName.split(',').slice(0, -1);
  for (let i = 0; i < arrFile.length; i++) {
    if (res == '') res = `${link}${arrFile[i]}`
    else res = `${res}, ${link}${arrFile[i]}`
  }
  return res;
}


exports.uploadFileNameRandom = async (folder, file_img) => {
  let filename = '';
  const time_created = Date.now();
  const date = new Date(time_created);
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const timestamp = Math.round(date.getTime() / 1000);

  const dir = `../Storage/base365/qlts/uploads/${folder}/${year}/${month}/${day}/`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  filename = `${timestamp}-tin-${file_img.originalFilename}`.replace(/,/g, '');
  const filePath = dir + filename;
  filename = filename + ',';

  fs.readFile(file_img.path, (err, data) => {
    if (err) {
      console.log(err)
    }
    fs.writeFile(filePath, data, (err) => {
      if (err) {
        console.log(err)
      }
    });
  });
  return filename;
}

// loại tài sản đã xoá
exports.loaiTaiSanXoa = async (res, LoaiTaiSan, dem, conditions, skip, limit) => {
  try {
    conditions.loai_da_xoa = 1
    let data = await LoaiTaiSan.aggregate([
      { $match: conditions },
      { $sort: { id_loai: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'id_loai',
          foreignField: 'id_loai_ts',
          pipeline: [{
            $match: {
              'ts_da_xoa': 1
            }
          }],
          as: "taiSan"

        }
      },
      {
        $lookup: {
          from: 'QLTS_Nhom_Tai_San',
          localField: 'id_nhom_ts',
          foreignField: 'id_nhom',
          as: 'nhom_ts',
        }
      },
      { $unwind: { path: "$nhom_ts", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          tongSoLuongTaiSan: { $sum: '$taiSan.ts_so_luong' },
          loai_date_delete: 1,
          id_loai: 1,
          ten_loai: 1,
          nhomTaiSan: '$nhom_ts.ten_nhom',
          loai_id_ng_xoa: 1
        }
      },

    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].loai_date_delete = new Date(data[i].loai_date_delete * 1000);
      let user = await Users.findOne({ idQLC: data[i].loai_id_ng_xoa }, { userName: 1 })
      if (user) {
        data[i].ng_xoa = user.userName
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// nhóm tài sản đã xoá
exports.nhomTaiSanDaXoa = async (res, nhomTaiSan, dem, conditions, skip, limit, LoaiTaiSan) => {
  try {
    conditions.nhom_da_xoa = 1;
    let data = await nhomTaiSan.aggregate([
      { $match: conditions },
      { $sort: { id_nhom: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'id_nhom',
          foreignField: 'id_nhom_ts',
          pipeline: [{
            $match: {
              'ts_da_xoa': 1
            }
          }],
          as: "taiSan",
        }
      },
      {
        $project: {
          tongSoLuongTaiSan: { $sum: '$taiSan.ts_so_luong' },
          nhom_date_delete: 1,
          id_nhom: 1,
          ten_nhom: 1,
          nhomTaiSan: '$nhom_ts.ten_nhom',
          nhom_id_ng_xoa: 1,
        }
      }
    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].nhom_date_delete = new Date(data[i].nhom_date_delete * 1000);
      let loaiTS = await LoaiTaiSan.find({ id_nhom_ts: data[i].id_nhom, loai_da_xoa: 1 }).count();
      data[i].soLuongLoaiTs = loaiTS
      let user = await Users.findOne({ idQLC: data[i].nhom_id_ng_xoa }, { userName: 1, idQLC: 1 })
      if (user) {
        data[i].ng_xoa = user.userName
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đã xoá
exports.taiSanXoa = async (res, TaiSan, dem, conditions, skip, limit, comId) => {
  try {
    conditions.ts_da_xoa = 1

    let data = await TaiSan.aggregate([
      { $match: conditions },
      { $sort: { ts_id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaits'
        }
      },
      { $unwind: '$loaits' },
      {
        $project: {
          tongSoLuongTaiSan: { $sum: '$taiSan.ts_so_luong' },
          ts_date_delete: 1,
          ts_ten: 1,
          loaitaisan: '$loaits.ten_loai',
          ts_id_ng_xoa: 1,
          ts_gia_tri: 1,
          ts_trangthai: 1,
          id_dv_quanly: 1,
          ts_id: 1,
          id_ten_quanly: 1,
          ts_so_luong: 1,

        }
      },

    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].ts_date_delete = new Date(data[i].ts_date_delete * 1000);
      let user = await Users.findOne({ idQLC: data[i].ts_id_ng_xoa }, { userName: 1 })
      let id_ten_quanly = await Users.findOne({ idQLC: data[i].id_ten_quanly }, { userName: 1 })
      let com_address = await Users.findOne({ idQLC: comId }, { userName: 1, address: 1 })
      if (user) {
        data[i].ng_xoa = user.userName
      }
      if (id_ten_quanly) {
        data[i].id_ten_quanly = id_ten_quanly.userName
      }
      if (com_address) {
        data[i].com_address = com_address.address
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản cấp phát đã xoá 
exports.capPhatXoa = async (res, CapPhat, dem, conditions, skip, limit) => {
  try {
    conditions.cp_da_xoa = 1;
    let data = await CapPhat.aggregate([
      { $match: conditions },
      { $sort: { cp_id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'cap_phat_taisan.ds_ts.ts_id',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'cp_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'user'
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          cp_id: 1,
          mataisan: '$taisan.ts_id',
          tentaisan: '$taisan.ts_ten',
          soluong: '$cap_phat_taisan.ds_ts.sl_cp',
          cp_lydo: 1,
          cp_vitri_sudung: 1,
          ng_xoa: '$user.userName',
          cp_ngay: 1,
          cp_date_delete: 1
        }
      },
      { $unwind: "$soluong" }
    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].cp_ngay = new Date(data[i].cp_ngay * 1000);
      data[i].cp_date_delete = new Date(data[i].cp_date_delete * 1000);

    }

    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản thu hồi đã xoá 
exports.thuHoiXoa = async (res, ThuHoi, dem, conditions, skip, limit, comId) => {
  try {

    conditions.xoa_thuhoi = 1;
    conditions.thuhoi_id_ng_xoa = { $ne: 0 };
    conditions.id_ng_dc_thuhoi = { $ne: 0 };
    let data = await ThuHoi.aggregate([
      { $match: conditions },
      { $sort: { thuhoi_id: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'thuhoi_taisan.ds_thuhoi.ts_id',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'thuhoi_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'user'
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_dc_thuhoi',
          foreignField: 'idQLC',
          as: 'users'
        }
      },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          thuhoi_ngay: 1,
          thuhoi_date_delete: 1,
          thuhoi_id: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          soluong: '$thuhoi_taisan.ds_thuhoi.sl_th',
          thuhoi_trangthai: 1,
          thuhoi__lydo: 1,
          id_ng_dc_thuhoi: '$users.userName',
          ng_xoa: '$user.userName'
        }
      },
      // {$unwind:'$soluong'}
    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].thuhoi_ngay = new Date(data[i].thuhoi_ngay * 1000);
      data[i].thuhoi_date_delete = new Date(data[i].thuhoi_date_delete * 1000);
    }

    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// điều chuyển vị trí tài sản
exports.dieuChuyenViTriTaiSanDaXoa = async (res, DieuChuyen, dem, conditions, skip, limit, comId) => {
  try {
    conditions.xoa_dieuchuyen = 1;
    conditions.dc_type = 0;
    //conditions.id_ng_xoa_dc = { $ne: 0 };
    //conditions.id_nv_dangsudung = { $ne: 0 };
    // conditions.id_pb_dang_sd = { $ne: 0 };
    conditions.id_nv_nhan = { $ne: 0 };
    // conditions.id_pb_nhan = { $ne: 0 };
    // conditions.id_ng_thuchien = { $ne: 0 };
    let data = await DieuChuyen.aggregate([
      { $match: conditions },
      { $sort: { dc_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_xoa_dc',
          foreignField: 'idQLC',
          as: 'user'
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_nv_dangsudung',
          foreignField: 'idQLC',
          as: 'users'
        }
      },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLC_Deparments',
          localField: 'id_pb_dang_sd',
          foreignField: 'dep_id',
          as: 'dep'
        }
      },
      { $unwind: { path: "$dep", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_nv_nhan',
          foreignField: 'idQLC',
          as: 'users_id_nv_nhan'
        }
      },
      { $unwind: { path: "$users_id_nv_nhan", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLC_Deparments',
          localField: 'id_pb_nhan',
          foreignField: 'dep_id',
          as: 'depp'
        }
      },
      { $unwind: { path: "$depp", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_thuchien',
          foreignField: 'idQLC',
          as: 'users_id_ng_thuchien'
        }
      },
      { $unwind: { path: "$users_id_ng_thuchien", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          dc_ngay: 1,
          dc_date_delete: 1,
          dc_id: 1,
          dc_trangthai: 1,
          id_nv_dangsudung: '$users.userName',
          id_pb_dang_sd: '$dep.dep_name',
          id_nv_nhan: '$users_id_nv_nhan.userName',
          id_pb_nhan: '$depp.dep_name',
          dc_lydo: 1,
          id_ng_thuchien: '$users_id_ng_thuchien.userName',
          ng_xoa: '$user.userName'
        }
      }
    ]);
    console.log("🚀 ~ file: qltsService.js:584 ~ exports.dieuChuyenViTriTaiSanDaXoa= ~ data:", data)
    for (let i = 0; i < data.length; i++) {
      data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
      data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
    }

    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// điều chuyển đối tượng sd
exports.dieuChuyenDoiTuongSdDaXoa = async (res, DieuChuyen, dem, conditions, skip, limit, comId) => {
  try {
    conditions.xoa_dieuchuyen = 1;
    conditions.dc_type = 1;
    let data = await DieuChuyen.aggregate([
      { $match: conditions },
      { $sort: { dc_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_xoa_dc',
          foreignField: 'idQLC',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_nv_dangsudung',
          foreignField: 'idQLC',
          as: 'users'
        }
      },
      { $unwind: '$users' },
      {
        $lookup: {
          from: 'QLC_Deparments',
          localField: 'id_pb_dang_sd',
          foreignField: 'dep_id',
          as: 'dep'
        }
      },
      { $unwind: '$dep' },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_nv_nhan',
          foreignField: 'idQLC',
          as: 'users_id_nv_nhan'
        }
      },
      { $unwind: '$users_id_nv_nhan' },
      {
        $lookup: {
          from: 'QLC_Deparments',
          localField: 'id_pb_nhan',
          foreignField: 'dep_id',
          as: 'depp'
        }
      },
      { $unwind: '$depp' },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_thuchien',
          foreignField: 'idQLC',
          as: 'users_id_ng_thuchien'
        }
      },
      { $unwind: '$users_id_ng_thuchien' },
      {
        $project: {
          dc_ngay: 1,
          dc_date_delete: 1,
          dc_id: 1,
          dc_trangthai: 1,
          id_nv_dangsudung: 'users.userName',
          id_pb_dang_sd: 'dep.dep_name',
          id_nv_nhan: 'users_id_nv_nhan.userName',
          id_pb_nhan: 'depp.dep_name',
          dc_lydo: 1,
          id_ng_thuchien: 'users_id_ng_thuchien.userName',
          ng_xoa: 'user.userName'
        }
      }
    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
      data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
    }

    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// điều chuyển đơn vị quản lý
exports.dieuChuyenDonViQuanLyDaXoa = async (res, DieuChuyen, dem, conditions, skip, limit, comId) => {
  try {
    conditions.xoa_dieuchuyen = 1;
    conditions.dc_type = 2;
    let data = await DieuChuyen.aggregate([
      { $match: conditions },
      { $sort: { dc_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_xoa_dc',
          foreignField: 'idQLC',
          as: 'user'
        }
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_cty_dang_sd',
          foreignField: 'idQLC',
          as: 'users'
        }
      },
      { $unwind: { path: "$users", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'Users',
          localField: 'id_cty_nhan',
          foreignField: 'idQLC',
          as: 'users_id_nv_nhan'
        }
      },
      { $unwind: { path: "$users_id_nv_nhan", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_thuchien',
          foreignField: 'idQLC',
          as: 'users_id_ng_thuchien'
        }
      },
      { $unwind: { path: "$users_id_ng_thuchien", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          dc_ngay: 1,
          dc_id: 1,
          dc_date_delete: 1,
          dc_trangthai: 1,
          id_cty_dang_sd: '$users.userName',
          id_cty_nhan: '$users_id_nv_nhan.userName',
          dc_lydo: 1,
          id_ng_thuchien: '$users_id_ng_thuchien.userName',
          ng_xoa: '$user.userName'
        }
      }
    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].dc_ngay = new Date(data[i].dc_ngay * 1000);
      data[i].dc_date_delete = new Date(data[i].dc_date_delete * 1000);
    }

    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản cần sửa chữa
exports.canSuaChua = async (res, SuaChua, dem, conditions, skip, limit) => {
  try {
    conditions.sc_trangthai = { $in: [0, 2] };
    let data = await SuaChua.aggregate([
      { $match: conditions },
      { $sort: { sc_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'suachua_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'sc_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'ng_xoa'
        }
      },
      { $unwind: { path: "$ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'sc_ng_sd',
          foreignField: 'idQLC',
          as: 'sc_ng_sd'
        }
      },
      { $unwind: { path: "$sc_ng_sd", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sc_id: 1,
          sc_trangthai: 1,
          sc_ngay: 1,
          sc_ngay_hong: 1,
          sc_date_delete: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          sl_sc: 1,
          sc_donvi: 1,
          sc_ngay_nhapkho: 1,
          sc_noidung: 1,
          ng_xoa: '$ng_xoa.userName',
          sc_ng_sd: '$sc_ng_sd.userName',
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].sc_ngay = new Date(data[i].sc_ngay * 1000)
      data[i].sc_ngay_hong = new Date(data[i].sc_ngay_hong * 1000)
      data[i].sc_date_delete = new Date(data[i].sc_date_delete * 1000)
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đang sửa chữa
exports.dangSuaChua = async (res, SuaChua, dem, conditions, skip, limit) => {
  try {
    conditions.sc_trangthai = 3;
    let data = await SuaChua.aggregate([
      { $match: conditions },
      { $sort: { sc_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'suachua_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'sc_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'ng_xoa'
        }
      },
      { $unwind: { path: "$ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sc_id: 1,
          sc_trangthai: 1,
          sc_chiphi_dukien: 1,
          sc_ngay: 1,
          sc_dukien: 1,
          sc_date_delete: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          sl_sc: 1,
          sc_donvi: 1,
          sc_ngay_nhapkho: 1,
          sc_noidung: 1,
          ng_xoa: '$ng_xoa.userName',
          sc_ng_sd: '$sc_ng_sd.userName',
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].sc_ngay = new Date(data[i].sc_ngay * 1000)
      data[i].sc_ngay_hong = new Date(data[i].sc_dukien * 1000)
      data[i].sc_date_delete = new Date(data[i].sc_date_delete * 1000)
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đã sửa chữa
exports.daSuaChua = async (res, SuaChua, dem, conditions, skip, limit) => {
  try {
    conditions.sc_trangthai = 1;
    let data = await SuaChua.aggregate([
      { $match: conditions },
      { $sort: { sc_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'suachua_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'sc_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'ng_xoa'
        }
      },
      { $unwind: { path: "$ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          sc_ngay: 1,
          sc_dukien: 1,
          sc_hoanthanh: 1,
          sc_date_delete: 1,
          sc_id: 1,
          sc_chiphi_dukien: 1,
          sc_chiphi_thucte: 1,
          sc_noidung: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',

          ng_xoa: '$ng_xoa.userName',

        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].sc_ngay = new Date(data[i].sc_ngay * 1000)
      data[i].sc_ngay_hong = new Date(data[i].sc_dukien * 1000)
      data[i].sc_date_delete = new Date(data[i].sc_date_delete * 1000)
      data[i].sc_hoanthanh = new Date(data[i].sc_hoanthanh * 1000)

    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản cần bảo dưỡng
exports.canBaoDuong = async (res, BaoDuong, dem, conditions, skip, limit) => {
  try {
    conditions.bd_trang_thai = { $in: [0, 2] }
    let data = await BaoDuong.aggregate([
      { $match: conditions },
      { $sort: { id_bd: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'baoduong_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'bd_id_ng_tao',
          foreignField: 'idQLC',
          as: 'bd_id_ng_tao'
        }
      },
      { $unwind: { path: "$bd_id_ng_tao", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'bd_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'bd_id_ng_xoa'
        }
      },
      { $unwind: { path: "$bd_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'bd_ng_sd',
          foreignField: 'idQLC',
          as: 'bd_ng_sd'
        }
      },
      { $unwind: { path: "$bd_ng_sd", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id_bd: 1,
          bd_trang_thai: 1,
          ts_ten: '$taisan.ts_ten',
          bd_sl: 1,
          bd_ng_sd: '$bd_ng_sd.userName',
          bd_vi_tri_dang_sd: 1,
          bd_gannhat: 1,
          bd_dukien_ht: 1,
          bd_date_create: 1,
          bd_date_delete: 1,
          bd_tai_congsuat: 1,
          bd_cs_dukien: 1,
          bd_noi_dung: 1,
          bd_id_ng_xoa: '$bd_id_ng_xoa.userName'
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].bd_gannhat = new Date(data[i].bd_gannhat * 1000)
      data[i].bd_dukien_ht = new Date(data[i].bd_dukien_ht * 1000)
      data[i].bd_date_create = new Date(data[i].bd_date_create * 1000)
      data[i].bd_date_delete = new Date(data[i].bd_date_delete * 1000)
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đang bảo dưỡng
exports.dangBaoDuong = async (res, BaoDuong, dem, conditions, skip, limit) => {
  try {
    conditions.bd_trang_thai = 0
    let data = await BaoDuong.aggregate([
      { $match: conditions },
      { $sort: { id_bd: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'baoduong_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'bd_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'bd_id_ng_xoa'
        }
      },
      { $unwind: { path: "$bd_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id_bd: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          bd_sl: 1,
          bd_tai_congsuat: 1,
          bd_chiphi_dukien: 1,
          bd_ngay_batdau: 1,
          bd_dukien_ht: 1,
          bd_noi_dung: 1,
          bd_date_delete: 1,
          bd_id_ng_xoa: '$bd_id_ng_xoa.userName'
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].bd_ngay_batdau = new Date(data[i].bd_ngay_batdau * 1000)
      data[i].bd_dukien_ht = new Date(data[i].bd_dukien_ht * 1000)
      data[i].bd_date_delete = new Date(data[i].bd_date_delete * 1000)
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đã bảo dưỡng
exports.daBaoDuong = async (res, BaoDuong, dem, conditions, skip, limit) => {
  try {
    conditions.bd_trang_thai = 1
    let data = await BaoDuong.aggregate([
      { $match: conditions },
      { $sort: { id_bd: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'baoduong_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'bd_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'bd_id_ng_xoa'
        }
      },
      { $unwind: { path: "$bd_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id_bd: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          bd_sl: 1,
          bd_tai_congsuat: 1,
          bd_chiphi_dukien: 1,
          bd_chiphi_thucte: 1,
          bd_ngay_batdau: 1,
          bd_dukien_ht: 1,
          bd_ngay_ht: 1,
          bd_ngay_sudung: 1,
          bd_noi_dung: 1,
          bd_date_delete: 1,
          bd_id_ng_xoa: '$bd_id_ng_xoa.userName'
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].bd_ngay_batdau = new Date(data[i].bd_ngay_batdau * 1000)
      data[i].bd_dukien_ht = new Date(data[i].bd_dukien_ht * 1000)
      data[i].bd_ngay_ht = new Date(data[i].bd_ngay_ht * 1000)
      data[i].bd_ngay_sudung = new Date(data[i].bd_ngay_sudung * 1000)
      data[i].bd_date_delete = new Date(data[i].bd_date_delete * 1000)

    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// thiết lập lịch bảo dưỡng
exports.thietLapLichBaoDuong = async (res, Quydinh_bd, dem, conditions, skip, limit, search) => {
  try {

    let data = await Quydinh_bd.aggregate([
      { $match: conditions },
      { $sort: { qd_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'id_loai',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: { path: "$loaitaisan", preserveNullAndEmptyArrays: true } },
      { $match: search },
      {
        $lookup: {
          from: 'QLTS_Nhom_Tai_San',
          localField: 'loaitaisan.id_nhom_ts',
          foreignField: 'id_nhom',
          as: 'tennhom'
        }
      },
      { $unwind: { path: "$tennhom", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'qd_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'qd_id_ng_xoa'
        }
      },
      { $unwind: { path: "$qd_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          qd_id: 1,
          ten_loai: '$loaitaisan.ten_loai',
          tennhom: '$tennhom.ten_nhom',
          bd_noidung: 1,
          xac_dinh_bd: 1,
          tan_suat_bd: 1,
          qd_date_delete: 1,
          qd_id_ng_xoa: '$qd_id_ng_xoa.userName',
          thoidiem_bd: 1,
          sl_ngay_thoi_diem: 1,
          cong_suat_bd: 1
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].qd_date_delete = new Date(data[i].qd_date_delete * 1000)
      if (data[i].thoidiem_bd === 0 && data[i].sl_ngay_thoi_diem !== 0) {
        data[i].thoidiem_bd = "Sau ngày bắt đầu sử dụng " + data[i].sl_ngay_thoi_diem + " ngày"
      } else if (data[i].thoidiem_bd === 1 && data[i].sl_ngay_thoi_diem !== 0) {
        data[i].thoidiem_bd = "Sau ngày mua " + data[i].sl_ngay_thoi_diem + " ngày";
      } else if (data[i].thoidiem_bd === 2 && data[i].ngay_tu_chon_td !== 0) {
        data[i].thoidiem_bd = new Date(data[i].ngay_tu_chon_td * 1000)
      } else if (data[i].sl_ngay_thoi_diem === 0 || data[i].sl_ngay_thoi_diem === "" || data[i].ngay_tu_chon_td === 0) {
        data[i].thoidiem_bd = '---';
      }
      if (data[i].xac_dinh_bd === 1) {
        data[i].cs_bd_bd_vip = data[i].cong_suat_bd
      } else {
        data[i].cs_bd_bd_vip = '---';
      }
    }


    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// Quản lý đơn vị đo công suất
exports.quanLyDonViDoCongSuat = async (res, DonViCS, dem, conditions, skip, limit) => {
  try {
    let data = await DonViCS.aggregate([
      { $match: conditions },
      { $sort: { id_donvi: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'Users',
          localField: 'dvcs_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'dvcs_id_ng_xoa'
        }
      },
      { $unwind: '$dvcs_id_ng_xoa' },
      {
        $project: {
          id_donvi: 1,
          ten_donvi: 1,
          mota_donvi: 1,
          dvcs_date_delete: 1,
          dvcs_id_ng_xoa: '$dvcs_id_ng_xoa.userName',

        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].dvcs_date_delete = new Date(data[i].dvcs_date_delete * 1000)


    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// Theo dõi công suất
exports.theoDoiCongSuat = async (res, TheoDoiCongSuat, dem, conditions, skip, limit) => {
  try {

    let data = await TheoDoiCongSuat.aggregate([
      { $match: conditions },
      { $sort: { id_cs: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'id_loai',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $lookup: {
          from: 'QLTS_Don_Vi_CS',
          localField: 'id_donvi',
          foreignField: 'id_donvi',
          as: 'donvics'
        }
      },
      { $unwind: '$donvics' },
      {
        $lookup: {
          from: 'Users',
          localField: 'tdcs_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'tdcs_id_ng_xoa'
        }
      },
      { $unwind: { path: "$tdcs_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'loaitaisan.id_loai',
          foreignField: 'id_loai_ts',
          as: 'taisan'
        }
      },
      { $unwind: { path: "$taisan", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id_cs: 1,
          mataisan: '$taisan.ts_id',
          tentaisan: '$taisan.ts_ten',
          loaitaisan: '$loaitaisan.ten_loai',
          trangthai: '$taisan.ts_trangthai',
          congsuat: '$cs_gannhat',
          donvido: '$ten_donvi',
          ngaycapnhatgannhat: '$nhap_ngay',
          ngaycapnhattieptheo: '$date_update',
          ngayxoa: '$tdcs_date_delete',
          ngxoa: '$tdcs_id_ng_xoa.userName'
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      if (data[i].ngaycapnhatgannhat != 0) {
        data[i].ngaycapnhatgannhat = new Date(data[i].ngaycapnhatgannhat * 1000)
      }
      if (data[i].ngaycapnhattieptheo != 0) {
        data[i].ngaycapnhattieptheo = new Date(data[i].ngaycapnhattieptheo * 1000)
      }
      if (data[i].ngayxoa != 0) {
        data[i].ngayxoa = new Date(data[i].ngayxoa * 1000)
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản báo mất
exports.taiSanBaoMat = async (res, Mat, dem, conditions, skip, limit) => {
  try {
    conditions.mat_trangthai = { $in: [0, 2] }
    let data = await Mat.aggregate([
      { $match: conditions },
      { $sort: { mat_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'mat_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'mat_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'mat_id_ng_xoa'
        }
      },
      { $unwind: { path: "$mat_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'taisan.id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $project: {
          mat_id: 1,
          mat_trangthai: 1,
          mat_date_create: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          mat_soluong: 1,
          id_loai_ts: '$loaitaisan.ten_loai',
          id_ng_tao: 1,
          phongban: '---',
          mat_ngay: 1,
          mat_lydo: 1,
          mat_date_delete: 1,
          mat_id_ng_xoa: '$mat_id_ng_xoa.userName',
          tenloai: '$loaitaisan.ten_loai',
          mat_type_quyen: 1,
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].mat_date_create = new Date(data[i].mat_date_create * 1000)
      data[i].mat_ngay = new Date(data[i].mat_ngay * 1000)
      data[i].mat_date_delete = new Date(data[i].mat_date_delete * 1000)
      let check = await Users.findOne({ idQLC: data[i].id_ng_tao })
      if (check) {
        data[i].id_ng_tao = check.userName
      }
      if (data[i].mat_type_quyen == 2) {
        if (check && check.inForPerson && check.inForPerson.employee) {
          let dep = await department.findOne({ dep_id: check.inForPerson.employee.dep_id })
          if (dep) data[i].phongban = dep.dep_name
        }
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản chờ đền bù
exports.taiSanChoDenBu = async (res, Mat, dem, conditions, skip, limit) => {
  try {
    conditions.mat_id_ng_xoa = { $ne: 0 };
    conditions.id_ng_duyet = { $ne: 0 };
    conditions.id_ng_nhan_denbu = { $ne: 0 };
    conditions.mat_trangthai = 3
    let data = await Mat.aggregate([
      { $match: conditions },
      { $sort: { mat_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'mat_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'mat_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'mat_id_ng_xoa'
        }
      },
      { $unwind: { path: "$mat_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_duyet',
          foreignField: 'idQLC',
          as: 'id_ng_duyet'
        }
      },
      { $unwind: { path: "$id_ng_duyet", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_nhan_denbu',
          foreignField: 'idQLC',
          as: 'id_ng_nhan_denbu'
        }
      },
      { $unwind: { path: "$id_ng_nhan_denbu", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'taisan.id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $project: {
          mat_id: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          mat_soluong: 1,
          tenloai: '$loaitaisan.ten_loai',
          id_ng_tao: 1,
          mat_ngay: 1,
          mat_lydo: 1,
          id_ng_duyet: '$id_ng_duyet.userName',
          hinhthuc_denbu: 1,
          so_tien_da_duyet: 1,
          id_ng_nhan_denbu: '$id_ng_nhan_denbu.userName',
          mat_id_ng_xoa: '$mat_id_ng_xoa.userName',
          mat_ngay: 1,
          mat_han_ht: 1,
          mat_date_delete: 1,
          mat_type_quyen: 1,
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].mat_ngay = new Date(data[i].mat_ngay * 1000)
      data[i].mat_han_ht = new Date(data[i].mat_han_ht * 1000)
      data[i].mat_date_delete = new Date(data[i].mat_date_delete * 1000)
      let check = await Users.findOne({ idQLC: data[i].id_ng_tao })
      if (check) {
        data[i].id_ng_tao = check.userName
      }
      if (data[i].mat_type_quyen == 2) {
        if (check && check.inForPerson && check.inForPerson.employee) {
          let dep = await department.findOne({ dep_id: check.inForPerson.employee.dep_id })
          if (dep) data[i].phongban = dep.dep_name
        }
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// danh sách tài sản mất
exports.danhSachTaiSanMat = async (res, Mat, dem, conditions, skip, limit) => {
  try {
    conditions.mat_trangthai = 1
    let data = await Mat.aggregate([
      { $match: conditions },
      { $sort: { mat_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'mat_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_tao',
          foreignField: 'idQLC',
          as: 'id_ng_tao'
        }
      },
      { $unwind: { path: "$id_ng_tao", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'mat_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'mat_id_ng_xoa'
        }
      },
      { $unwind: { path: "$mat_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ngdexuat',
          foreignField: 'idQLC',
          as: 'id_ngdexuat'
        }
      },
      { $unwind: { path: "$id_ngdexuat", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_duyet',
          foreignField: 'idQLC',
          as: 'id_ng_duyet'
        }
      },
      { $unwind: { path: "$id_ng_duyet", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_nhan_denbu',
          foreignField: 'idQLC',
          as: 'id_ng_nhan_denbu'
        }
      },
      { $unwind: { path: "$id_ng_nhan_denbu", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'taisan.id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $project: {
          mat_id: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          mat_soluong: 1,
          id_loai_ts: '$id_loai_ts.ten_loai',
          id_ng_tao: '$id_ng_tao.userName',
          mat_ngay: 1,
          mat_lydo: 1,
          id_ng_duyet: 1,
          hinhthuc_denbu: 1,
          tien_denbu: 1,
          sotien_danhan: 1,
          id_ng_nhan_denbu: '$id_ng_nhan_denbu.userName',
          mat_han_ht: 1,
          mat_date_delete: 1,
          ngay_thanhtoan: 1,
          mat_id_ng_xoa: '$mat_id_ng_xoa.userName',
          id_ng_duyet: '$id_ng_duyet.userName',
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].mat_ngay = new Date(data[i].mat_ngay * 1000)
      data[i].mat_han_ht = new Date(data[i].mat_han_ht * 1000)
      data[i].mat_date_delete = new Date(data[i].mat_date_delete * 1000)
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đề xuất huỷ
exports.taiSanDeXuatHuy = async (res, Huy, dem, conditions, skip, limit) => {
  try {
    conditions.huy_trangthai = { $in: [0, 2] }
    conditions.huy_id_ng_xoa = { $ne: 0 }
    conditions.id_ng_dexuat = { $ne: 0 }
    let data = await Huy.aggregate([
      { $match: conditions },
      { $sort: { huy_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'huy_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'huy_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'huy_id_ng_xoa'
        }
      },
      { $unwind: { path: "$huy_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'taisan.id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $project: {
          huy_id: 1,
          huy_date_create: 1,
          huy_trangthai: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          huy_soluong: 1,
          ten_loai: '$loaitaisan.ten_loai',
          huy_lydo: 1,
          huy_date_delete: 1,
          huy_id_ng_xoa: '$huy_id_ng_xoa.userName',
          id_ng_dexuat: 1,
          huy_type_quyen: 1
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].huy_date_create = new Date(data[i].huy_date_create * 1000)
      data[i].huy_date_delete = new Date(data[i].huy_date_delete * 1000)
      let check = await Users.findOne({ idQLC: data[i].id_ng_dexuat })
      if (check) {
        data[i].id_ng_dexuat = check.userName
      }
      if (data[i].huy_type_quyen == 2) {
        if (check && check.inForPerson && check.inForPerson.employee) {
          let dep = await department.findOne({ dep_id: check.inForPerson.employee.dep_id })
          if (dep) data[i].vi_tri_ts = dep.dep_name
        }
      }
      if (data[i].huy_type_quyen === 1) {
        data[i].vi_tri_ts = '---';
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// danh sách tài sản huỷ
exports.danhSachTaiSanHuy = async (res, Huy, dem, conditions, skip, limit) => {
  try {
    conditions.huy_trangthai = 1
    let data = await Huy.aggregate([
      { $match: conditions },
      { $sort: { huy_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'huy_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'huy_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'huy_id_ng_xoa'
        }
      },
      { $unwind: { path: "$huy_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'Users',
          localField: 'id_ng_duyet',
          foreignField: 'idQLC',
          as: 'id_ng_duyet'
        }
      },
      { $unwind: { path: "$id_ng_duyet", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'taisan.id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $project: {
          huy_id: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          huy_soluong: 1,
          ten_loai: '$loaitaisan.ten_loai',
          id_ng_duyet: '$id_ng_duyet.userName',
          huy_lydo: 1,
          huy_ngayduyet: 1,
          huy_date_delete: 1,
          huy_id_ng_xoa: '$huy_id_ng_xoa.userName',
          huy_type_quyen: 1,
          id_ng_tao: 1
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].huy_ngayduyet = new Date(data[i].huy_ngayduyet * 1000)
      data[i].huy_date_delete = new Date(data[i].huy_date_delete * 1000)
      let check = await Users.findOne({ idQLC: data[i].id_ng_tao })
      if (check) {
        data[i].id_ng_tao = check.userName
      }
      if (data[i].huy_type_quyen == 2) {
        if (check && check.inForPerson && check.inForPerson.employee) {
          let dep = await department.findOne({ dep_id: check.inForPerson.employee.dep_id })
          if (dep) data[i].vi_tri_ts = dep.dep_name
        }
      }
      if (data[i].huy_type_quyen === 1) {
        data[i].vi_tri_ts = '---';
      }

    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đề xuất thanh lý
exports.taiSanDeXuatThanhLy = async (res, ThanhLy, dem, conditions, skip, limit) => {
  try {
    conditions.tl_trangthai = { $in: [0, 2] }
    let data = await ThanhLy.aggregate([
      { $match: conditions },
      { $sort: { tl_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'thanhly_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'tl_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'tl_id_ng_xoa'
        }
      },
      { $unwind: { path: "$tl_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'taisan.id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $project: {
          tl_id: 1,
          tl_date_create: 1,
          tl_date_delete: 1,
          tl_thanhly: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          ten_loai: '$loaitaisan.ten_loai',
          tl_soluong: 1,
          tl_lydo: 1,
          tl_id_ng_xoa: '$tl_id_ng_xoa.userName',
          id_ngdexuat: 1,
          tl_type_quyen: 1,
          vi_tri_ts:1
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].tl_date_create = new Date(data[i].tl_date_create * 1000)
      data[i].tl_date_delete = new Date(data[i].tl_date_delete * 1000)
      let check = await Users.findOne({ idQLC: data[i].id_ngdexuat })
      if (check) {
        data[i].id_ngdexuat = check.userName
        if (data[i].tl_type_quyen == 2) {
          if (check && check.inForPerson && check.inForPerson.employee) {
            let dep = await department.findOne({ dep_id: check.inForPerson.employee.dep_id })
            if (dep) data[i].vi_tri_ts = dep.dep_name
          }
        }
        if (data[i].tl_type_quyen === 1) {
          data[i].vi_tri_ts = check.address
        }
      }

    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// danh sách tài sản đã thanh lý
exports.taiSanDaThanhLy = async (res, ThanhLy, dem, conditions, skip, limit) => {
  try {
    conditions.tl_trangthai = 3
    let data = await ThanhLy.aggregate([
      { $match: conditions },
      { $sort: { tl_id: -1 } },
      { $skip: skip },
      { $limit: limit },

      {
        $lookup: {
          from: 'QLTS_Tai_San',
          localField: 'thanhly_taisan',
          foreignField: 'ts_id',
          as: 'taisan'
        }
      },
      { $unwind: '$taisan' },
      {
        $lookup: {
          from: 'Users',
          localField: 'tl_id_ng_xoa',
          foreignField: 'idQLC',
          as: 'tl_id_ng_xoa'
        }
      },
      { $unwind: { path: "$tl_id_ng_xoa", preserveNullAndEmptyArrays: true } },
      

      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'taisan.id_loai_ts',
          foreignField: 'id_loai',
          as: 'loaitaisan'
        }
      },
      { $unwind: '$loaitaisan' },
      {
        $project: {
          tl_id: 1,
          ts_id: '$taisan.ts_id',
          ts_ten: '$taisan.ts_ten',
          tl_soluong: 1,
          ten_loai: '$loaitaisan.ten_loai',
          tl_lydo: 1,
          ngay_duyet: 1,
          tl_ngay: 1,
          tl_date_delete: 1,
          tl_sotien: 1,
          tl_id_ng_xoa: '$tl_id_ng_xoa.userName',
          tl_type_quyen:1,
          id_ngdexuat:1
        }
      }
    ])
    for (let i = 0; i < data.length; i++) {
      data[i].ngay_duyet = new Date(data[i].ngay_duyet * 1000)
      data[i].tl_ngay = new Date(data[i].tl_ngay * 1000)
      let check = await Users.findOne({ idQLC: data[i].id_ngdexuat })
      if (check) {
        data[i].id_ngdexuat = check.userName
        if (data[i].tl_type_quyen == 2) {
          if (check && check.inForPerson && check.inForPerson.employee) {
            let dep = await department.findOne({ dep_id: check.inForPerson.employee.dep_id })
            if (dep) data[i].phongban = dep.dep_name
          }
        }
        if (data[i].tl_type_quyen === 1) {
          data[i].phongban = check.address
        }
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

exports.maxIDNhacNho = async (model) => {
  let maxId = await model.findOne({}, {}, { sort: { id_nhac_nho: -1 } });
  if (maxId) {
    return maxId.id_nhac_nho;
  } else {
    return 0;
  }

}

exports.maxID_dvcs = async (model) => {
  let dvcs = await model.findOne({}, {}, { sort: { id_donvi: -1 } });
  if (dvcs) {
    return dvcs.id_donvi;
  } else {
    return 0;
  }
}