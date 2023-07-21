
const phanQuyen = require('../../models/QuanLyTaiSan/PhanQuyen');
const Users = require('../../models/Users');

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
exports.nhomTaiSanDaXoa = async (res, nhomTaiSan, dem, conditions, skip, limit,LoaiTaiSan) => {
  try {
    conditions.nhom_da_xoa = 1;
    let data = await nhomTaiSan.aggregate([
      { $match: conditions },
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
      let loaiTS = await LoaiTaiSan.find({id_nhom_ts: data[i].id_nhom,loai_da_xoa:1}).count();
      data[i].soLuongLoaiTs = loaiTS
      let user = await Users.findOne({ idQLC: data[i].nhom_id_ng_xoa }, { userName: 1, idQLC: 1 })
      if (user) {
        data[i].ng_xoa = user.userName
      }
    }
    return functions.success(res,'get data success',{dem,data})
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}

// tài sản đã xoá
exports.taiSanXoa = async (res, TaiSan, dem, conditions, skip, limit,comId)=>{
  try {
    conditions.ts_da_xoa = 1
    let data = await TaiSan.aggregate([
      { $match: conditions },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'id_loai_ts',
          foreignField: 'id_loai',
          as: "taiSan"

        }
      },
      {
        $project: {
          tongSoLuongTaiSan: { $sum: '$taiSan.ts_so_luong' },
          ts_date_delete: 1,
          ts_ten: 1,
          ten_loai: 1,
          nhomTaiSan: '$nhom_ts.ten_nhom',
          ts_id_ng_xoa: 1,
          ts_gia_tri:1,
          ts_trangthai:1,
          id_dv_quanly:1,
          ts_id:1,
          id_ten_quanly:1
        }
      },

    ]);
    for (let i = 0; i < data.length; i++) {
      data[i].ts_date_delete = new Date(data[i].ts_date_delete * 1000);
      let user = await Users.findOne({ idQLC: data[i].ts_id_ng_xoa }, { userName: 1 })
      let id_ten_quanly = await Users.findOne({ idQLC: data[i].id_ten_quanly }, { userName: 1 })
      let com_address = await Users.findOne({ idQLC: comId }, { userName: 1,address:1 })
      if (user) {
        data[i].ng_xoa = user.userName
      }
      if(id_ten_quanly){
        data[i].id_ten_quanly = id_ten_quanly.userName
      }
      if(com_address){
        data[i].com_address = com_address.address
      }
    }
    return functions.success(res, 'get data success', { dem, data })
  } catch (error) {
    console.error(error)
    return functions.setError(res, error)
  }
}