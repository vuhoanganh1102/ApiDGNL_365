


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


exports.validateTaiSanInput = (ts_ten,ts_don_vi,id_dv_quanly,id_ten_quanly,id_loai_ts,ts_vi_tri) => {
    if (!ts_ten) {
      throw { code: 400, message: 'Tên tài sản bắt buộc.' };
    }
    else if(!ts_don_vi){
      throw {code : 400 , message : "đơn vị tính không không được bỏ trống"} 
    }
    else if(!id_dv_quanly){
      throw {code : 400 , message : "id_dv_quanly không không được bỏ trống"} 
    }
    else if(!id_ten_quanly){
      throw {code : 400 , message : "id_ten_quanly không không được bỏ trống"} 
    }
    else if(!id_loai_ts){
      throw {code : 400 , message : "id_loai_ts không không được bỏ trống"} 
    }
    else if(!ts_vi_tri){
      throw {code : 400 , message : "ts_vi_tri không không được bỏ trống"} 
    }
    return true;
  };
  


exports.getDatafindOneAndUpdate = async (model, condition, projection) => {
    return model.findOneAndUpdate(condition, projection);
  };

exports.getDataFromToken = async(req, res, next) => {
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