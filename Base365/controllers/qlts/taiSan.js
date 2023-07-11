const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ViTri_ts = require('../../models/QuanLyTaiSan/ViTri_ts');
const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const quanlytaisanService = require('../../services/QLTS/qltsService')
const NhomTs = require('../../models/QuanLyTaiSan/NhomTaiSan')
const TaiSanViTri = require('../../models/QuanLyTaiSan/TaiSanVitri')
const User = require('../../models/Users')


const functions = require('../../services/functions')


exports.showAll = async (req, res) => {
  try {
    let { page, perPage, ts_ten, id_nhom_ts, id_vitri, id_user, ts_trangthai } = req.body;
    let com_id = '';

    // Thiết lập giá trị mặc định cho page và perPage nếu không được cung cấp
    page = page || 1;
    perPage = perPage || 10;

    // Tính toán startIndex và endIndex
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    let query = {
      ts_da_xoa: 0,
    };

    if (ts_ten) {
      query.ts_ten = { $regex: ts_ten, $options: "i" };
    }
    if (id_nhom_ts) {
      query.id_nhom_ts = id_nhom_ts;
    }
    if (id_vitri) {
      query.id_vitri = id_vitri;
    }
    if (id_user) {
      query.id_user = id_user;
    }
    if (ts_trangthai) {
      query.ts_trangthai = ts_trangthai;
    }

    // Kiểm tra loại người dùng và lấy com_id tương ứng
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
    } else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }

    let searchTs = await TaiSan.find({ id_cty: com_id, ...query })
      .sort({ ts_id: -1 })
      .skip(startIndex)
      .limit(perPage);

    // Lấy tổng số lượng tài sản
    const totalTsCount = await TaiSan.countDocuments({ id_cty: com_id, ...query });

    // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = endIndex < totalTsCount;

    return functions.success(res, 'get data success', { searchTs, totalPages, hasNextPage });
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};


exports.showDataSearch = async (req, res) => {
  try {
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
    } else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let checktaisan = await TaiSan.distinct('id_ten_quanly', { id_cty: com_id })
    let listUser = await User.find({ 'inForPerson.employee.com_id': com_id, idQLC: { $in: checktaisan } }).select('idQLC userName');
    let listVitri = await ViTri_ts.find({ id_cty: com_id }).select('id_vitri vi_tri');
    let listloaiTaiSan = await LoaiTaiSan.find({ id_cty: com_id }).select('id_loai ten_loai')
    let checkNhom = await NhomTs.find({id_cty: com_id}).select('id_nhom')
    let item = {
     
      totalUser: listUser.length,
      totalVitri: listVitri.length,
      totalloaiTaiSan: listloaiTaiSan.length,
      totalNhom : checkNhom.length,
      listUser,
      listVitri,
      listloaiTaiSan,
    }
    return functions.success(res, 'get data success', { item })
  } catch (error) {
    console.log(error);
    return functions.setError(res, error)
  }
}


exports.showadd = async (req, res) => {
  try {
    if (req.user.data.type = 1) {
      let com_id = req.user.data.idQLC
      let checktaisan = await TaiSan.distinct('id_ten_quanly', { id_cty: com_id })
      let listUser = await User.find({ 'inForPerson.employee.com_id': com_id, idQLC: { $in: checktaisan } }).select('idQLC userName');;
      let listVitri = await ViTri_ts.find({ id_cty: com_id }).select('id_vitri vi_tri');
      let listloaiTaiSan = await LoaiTaiSan.find({ id_cty: com_id }).select('id_loai ten_loai')
      let item = {
        listUser,
        listVitri,
        listloaiTaiSan
      }
      return functions.success(res, 'get data success', { item })
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400)
    }
  } catch (error) {
    console.log(error);
    return functions.setError(res, error)
  }
}


exports.addTaiSan = async (req, res) => {
  try {
    let {
      id_loai_ts,id_dv_quanly,
      id_ten_quanly,ts_ten, sl_bandau, ts_so_luong,
      soluong_cp_bb, ts_gia_tri, ts_don_vi, ts_vi_tri,
      ts_trangthai, ts_da_xoa, ts_date_delete,
      don_vi_tinh, ghi_chu
    } = req.body
    const createDate = Math.floor(Date.now() / 1000);
    if (req.user.data.type == 1){
      let com_id = req.user.data.idQLC;
    }else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const validationResult = quanlytaisanService.validateTaiSanInput(ts_ten,ts_don_vi,id_dv_quanly,id_ten_quanly,id_loai_ts,ts_vi_tri);
    if (validationResult === true) {
        const checkidNhom = await LoaiTaiSan.findOne({id_loai :id_loai_ts,loai_da_xoa : 0}).select('id_nhom_ts')
        let maxID = await quanlytaisanService.getMaxID(TaiSan);
        let ts_id = 0;
        if (maxID) {
          ts_id = Number(maxID) + 1;
        }
        let createNew = new TaiSan({
          ts_id: ts_id,
          id_cty: com_id,
          id_loai_ts: id_loai_ts,
          id_nhom_ts: checkidNhom.id_nhom_ts,
          id_dv_quanly: id_dv_quanly,
          id_ten_quanly: id_ten_quanly,
          ts_ten: ts_ten,
          sl_bandau: sl_bandau,
          soluong_cp_bb: soluong_cp_bb,
          ts_gia_tri: ts_gia_tri,
          ts_don_vi: ts_don_vi,
          ts_vi_tri: ts_vi_tri,
          ts_trangthai: ts_trangthai,
          ts_da_xoa: ts_da_xoa,
          ts_date_create: createDate,
          ts_date_delete: ts_date_delete,
          don_vi_tinh: don_vi_tinh,
          ghi_chu: ghi_chu,
        })
        let save = await createNew.save();
        let maxIDTSVT = await quanlytaisanService.getMaxIDTSVT(TaiSanViTri);
        let tsvt_id = 0;
        if (maxIDTSVT) {
          tsvt_id = Number(maxIDTSVT) + 1;
        }
        let createNewTSVT = new TaiSanViTri({
          tsvt_id: tsvt_id,
          tsvt_cty: save.id_cty,
          tsvt_taisan: save.ts_id,
          tsvt_vitri : save.ts_vi_tri,
          tsvt_soluong : ts_so_luong
          
        })
        let saveTSVT = await createNewTSVT.save();
        return functions.success(res, 'save data success', { save,saveTSVT})
      }
  } catch (error) {
    console.log(error);
    return functions.setError(res, error)
  }
}

exports.showCTts = async (req, res) => {
  try {
    let { ts_id } = req.body;

    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }

    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài phải là một số', 400);
    }

    let com_id = '';
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
    } else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let checkts = await TaiSan.findOne({ ts_id: ts_id });
    if (!checkts) {
      return functions.setError(res, 'Không tìm thấy tài sản', 404);
    }

    let chekNhom = await NhomTs.findOne({ id_nhom: checkts.id_nhom_ts }).select('ten_nhom');
    let checkloaiTaiSan = await LoaiTaiSan.findOne({ id_loai: checkts.id_loai_ts }).select('ten_loai');
    let chekVitri = await ViTri_ts.findOne({ id_vitri: checkts.ts_vi_tri }).select('vi_tri dv_quan_ly');
    let checkUser = await User.findOne({ idQLC: checkts.id_ten_quanly }).select('userName');

    let data = [
      checkts, chekNhom, checkloaiTaiSan, chekVitri, checkUser
    ];

    return functions.success(res, 'Lấy dữ liệu thành công', { data });
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};

exports.deleteTs = async (req, res) => {
  try {
   
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
}