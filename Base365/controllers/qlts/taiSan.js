const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ViTri_ts = require('../../models/QuanLyTaiSan/ViTri_ts');
const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const quanlytaisanService = require('../../services/QLTS/qltsService')
const NhomTs = require('../../models/QuanLyTaiSan/NhomTaiSan')
const TaiSanViTri = require('../../models/QuanLyTaiSan/TaiSanVitri')
const User = require('../../models/Users')
const functions = require('../../services/functions');
const serviceQLTS = require('../../services/QLTS/qltsService')
const KhauHao = require('../../models/QuanLyTaiSan/KhauHao');
const TepDinhKem = require('../../models/QuanLyTaiSan/TepDinhKem');
const SuaChua = require('../../models/QuanLyTaiSan/Sua_chua');
const BaoDuong = require('../../models/QuanLyTaiSan/BaoDuong');
const PhanBo = require('../../models/QuanLyTaiSan/PhanBo');
const QuaTrinhSuDung = require('../../models/QuanLyTaiSan/QuaTrinhSuDung');
const GhiTang = require('../../models/QuanLyTaiSan/GhiTang_TS');
const CapPhat = require('../../models/QuanLyTaiSan/CapPhat');
const ThuHoi = require('../../models/QuanLyTaiSan/ThuHoi');
const ThongBao = require('../../models/QuanLyTaiSan/ThongBao');
const DieuChuyen = require('../../models/QuanLyTaiSan/DieuChuyen');
const Mat = require('../../models/QuanLyTaiSan/DieuChuyen');
const Huy = require('../../models/QuanLyTaiSan/DieuChuyen');
const ThanhLy = require('../../models/QuanLyTaiSan/DieuChuyen');

exports.showAll = async (req, res) => {
  try {
    let { page, perPage, ts_ten, id_loai_ts, ts_vi_tri, id_ten_quanly, ts_trangthai } = req.body;
    let com_id = '';
    page = parseInt(page) || 1; // Trang hiện tại (mặc định là trang 1)
    perPage = parseInt(perPage) || 10; // Số lượng bản ghi trên mỗi trang (mặc định là 10)
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      console.log(com_id)
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    ;
    // Tính toán startIndex và endIndex
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    let matchQuery = {
      id_cty : com_id,// Lọc theo com_id
      ts_da_xoa : 0
    };
    if (ts_ten) {
      matchQuery.ts_ten = { $regex: ts_ten, $options: "i" };
    }
    if(id_loai_ts){
      matchQuery.id_loai_ts = parseInt(id_loai_ts);
    }
    if (ts_vi_tri) {
      matchQuery.ts_vi_tri = parseInt(ts_vi_tri);
    }
    if (id_ten_quanly) {
      matchQuery.id_ten_quanly = parseInt(id_ten_quanly);
    }
    if (ts_trangthai) {
      matchQuery.ts_trangthai = parseInt(ts_trangthai);
    }
    let searchTs = await TaiSan.aggregate([
      {
        $match: matchQuery,
      },
      { $sort: { ts_id: -1 } },
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San',
          localField: 'id_loai_ts',
          foreignField: 'id_loai',
          as: 'name_loai',
        },
      },
      {
        $lookup: {
          from: 'QLTS_ViTri_ts',
          localField: 'ts_vi_tri',
          foreignField: 'id_vitri',
          as: 'name_vitri',
        },
      },
      {
        $lookup: {
          from: 'QLTS_ThuHoi',
          localField: 'ts_id',
          foreignField: 'thuhoi_taisan.ds_thuhoi.ts_id',
          as: 'thuhoi',
        },
      },
      {
        $lookup: {
          from: 'QLTS_Cap_Phat',
          localField: 'ts_id',
          foreignField: 'cap_phat_taisan.ds_ts.ts_id',
          as: 'cap_phat',
        },
      },
      {
        $unwind: {
          path: '$cap_phat',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$thuhoi',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$ts_id',
          ts_id: { $first: '$ts_id' },
          ts_ten: { $first: '$ts_ten' },
          nguoi_cam: { $first: '$id_ten_quanly' },
          tong_so_luong: { $addToSet: '$sl_bandau' },
          so_luong_cap_phat: {
            $sum: {
              $cond: [{ $eq: ['$cap_phat.cp_da_xoa', 0] }, { $size: '$cap_phat.cap_phat_taisan.ds_ts.ts_id' }, 0],
            },
          },
          so_luong_thu_hoi: {
            $sum: {
              $cond: [{ $eq: ['$thuhoi.xoa_thuhoi', 0] }, { $size: '$thuhoi.thuhoi_taisan.ds_thuhoi.ts_id' }, 0],
            },
          },
          so_luong_con_lai: { $first: '$soluong_cp_bb' },
          loai_ts: { $first: '$name_loai.ten_loai' },
          gia_tri: { $first: '$ts_gia_tri' },
          tinh_trang_su_dung: { $first: '$ts_trangthai' },
          don_vi_quan_ly: { $first: '$ts_don_vi' },
          vi_tri_tai_san: { $first: '$name_vitri.vi_tri' },
        },
      },
      {
        $sort: {
          ts_id: -1, 
        },
      },
      {
        $skip: startIndex,
      },
      {
        $limit: perPage,
      },
    ]);



    // Lấy tổng số lượng tài sản
    const totalTsCount = await TaiSan.countDocuments(matchQuery);

    // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = endIndex < totalTsCount;

    return functions.success(res, 'get data success', { searchTs, totalPages, hasNextPage });
  } catch(e){
    console.log(e);
    return functions.setError(res , e.message)
}
};


exports.showDataSearch = async (req, res) => {
  try {
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let checktaisan = await TaiSan.distinct('id_ten_quanly', { id_cty: com_id })
    let listTaiSan = await TaiSan.find({ id_cty: com_id, ts_da_xoa: 0 }).select('ts_id ts_ten')
    let listUser = await User.find({ 'inForPerson.employee.com_id': com_id, idQLC: { $in: checktaisan } }).select('idQLC userName');
    let listVitri = await ViTri_ts.find({ id_cty: com_id }).select('id_vitri vi_tri');
    let listloaiTaiSan = await LoaiTaiSan.find({ id_cty: com_id, loai_da_xoa: 0 }).select('id_loai ten_loai')
    let listNhom = await NhomTs.find({ id_cty: com_id, nhom_da_xoa: 0 }).select('id_nhom ten_nhom')
    let item = {
      totalTaiSan: listTaiSan.length,
      totalVitri: listVitri.length,
      totalloaiTaiSan: listloaiTaiSan.length,
      totalNhom: listNhom.length,
      listNhom,
      listUser,
      listVitri,
      listloaiTaiSan,
      listTaiSan,
    }
    return functions.success(res, 'get data success', { item })
  }  catch(e){
    return functions.setError(res , e.message)
}
}

// Đổ dữ liệu thêm mới tài sản
exports.showadd = async (req, res) => {
  try {
    let com_id = '';
    if (req.user.data.type = 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id
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
  }  catch(e){
    return functions.setError(res , e.message)
}
}


exports.addTaiSan = async (req, res) => {
  try {
    let {
      id_loai_ts, id_dv_quanly,
      id_ten_quanly, ts_ten, sl_bandau, ts_so_luong,
      soluong_cp_bb, ts_gia_tri, ts_don_vi, ts_vi_tri,
      ts_trangthai, ts_da_xoa, day_xoa,
      don_vi_tinh, ghi_chu
    } = req.body
    const createDate = Math.floor(Date.now() / 1000);
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const validationResult = quanlytaisanService.validateTaiSanInput(ts_ten, ts_don_vi, id_dv_quanly, id_ten_quanly, id_loai_ts, ts_vi_tri);
    const checkidNhom = await LoaiTaiSan.findOne({ id_loai: id_loai_ts, loai_da_xoa: 0 ,id_cty : com_id}).select('id_nhom_ts')
    if (!checkidNhom) {
      // Xử lý lỗi hoặc thông báo không tìm thấy nhóm tài sản tương ứng
      return functions.setError(res, 'Không tìm thấy nhóm tài sản tương ứng với id_loai_ts để thêm mới', 400);
    }
    let checkidVitri = await ViTri_ts.findOne({id_vitri : ts_vi_tri ,id_cty : com_id}).select('id_vitri')
    if(!checkidVitri){
      return functions.setError(res, 'Không tìm thấy vị trí tài sản tương ứng để thêm mới ', 400);
    }
    if (validationResult === true) {
      
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
        ts_vi_tri: checkidVitri.id_vitri,
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
        tsvt_vitri: save.ts_vi_tri,
        tsvt_soluong: ts_so_luong

      })
      let saveTSVT = await createNewTSVT.save();
      return functions.success(res, 'save data success', { save, saveTSVT })
    }
  }  catch(e){
    console.log(e)
    return functions.setError(res , e.message)
}
}

exports.showCTts = async (req, res) => {
  try {
    let { ts_id } = req.body;
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài phải là một số', 400);
    }
    let checkts = await TaiSan.findOne({ ts_id: ts_id ,id_cty : com_id});
    if (!checkts) {
      return functions.setError(res, 'Không tìm thấy tài sản', 404);
    }

    let chekNhom = await NhomTs.findOne({ id_nhom: checkts.id_nhom_ts,id_cty :com_id,nhom_da_xoa : 0 }).select('ten_nhom');
    if(!chekNhom){
      chekNhom = "";
    }
    let checkloaiTaiSan = await LoaiTaiSan.findOne({ id_loai: checkts.id_loai_ts,id_cty :com_id ,loai_da_xoa :0}).select('ten_loai');
    if(!checkloaiTaiSan){
      checkloaiTaiSan = "";
    }
    let chekVitri = await ViTri_ts.findOne({ id_vitri: checkts.ts_vi_tri,id_cty :com_id }).select('vi_tri ');
    if(!chekVitri){
      chekVitri = "";
    }
    let checkUser = await User.findOne({ idQLC: checkts.id_ten_quanly, $or: [
      { 'inForPerson.employee.com_id': com_id },
      { idQLC: com_id }
    ] }).select('userName');
    if(!checkUser){
      checkUser = "";
    }
    let checkGhiTang =  await GhiTang.findOne({ id_ts: checkts.ts_id}).select('sl_tang');
    if (!checkGhiTang) {
      checkGhiTang = 0;
    }
    let checkCapPhat = await CapPhat.findOne({
      'cap_phat_taisan.ds_ts': { $elemMatch: { ts_id: checkts.ts_id } },
      id_cty : com_id,
      cp_da_xoa : 0
    }).select('cap_phat_taisan');
    if(!checkCapPhat){
      checkCapPhat = { cap_phat_taisan: { ds_ts: [] } };
    }
    let checkThuHoi = await ThuHoi.findOne({
      'thuhoi_taisan.ds_thuhoi': { $elemMatch: { ts_id: checkts.ts_id } },
      id_cty : com_id,
      xoa_thuhoi : 0
    }).select('thuhoi_taisan');
    if(!checkThuHoi){
      checkThuHoi = { thuhoi_taisan: { ds_thuhoi: [] } };
    }
    let items = [
      {
        ma_tai_san: checkts.ts_id,
        ten_tai_san: checkts.ts_ten,
        so_luong: checkts.sl_bandau,
        so_luong_da_ghi_tang : checkGhiTang,
        so_luong_cap_phat : checkCapPhat.cap_phat_taisan.ds_ts.length,
        so_luong_thu_hoi : checkThuHoi.thuhoi_taisan.ds_thuhoi.length,
        so_luong_con_lai : checkts.soluong_cp_bb,
        don_vi_cung_cap : checkts.ts_don_vi,
        loai_tai_san : checkloaiTaiSan.ten_loai,
        nhom_tai_san : chekNhom,
        tinh_trang : checkts.ts_trangthai,
        don_vi_quan_ly : checkts.id_dv_quanly,
        nguoi_quan_ly : checkUser,
        vi_tri_tai_san : chekVitri.vi_tri,
        ghi_chu : checkts.ghi_chu
      }
    ];

    return functions.success(res, 'Lấy dữ liệu thành công', { items });
  }  catch(e){
    return functions.setError(res , e.message)
}
};

exports.deleteTs = async (req, res) => {
  try {
    let { type, ts_id} = req.body;
    let com_id = '';
    let ts_id_ng_xoa = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      ts_id_ng_xoa = req.user.data.idQLC;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const deleteDate = Math.floor(Date.now() / 1000);
    if (!ts_id.every(num => !isNaN(parseInt(num)))) {
      return functions.setError(res, 'ts_id không hợp lệ', 400);
    }
    if (type == 1) { // xóa vĩnh viễn
      let idArraya = ts_id.map(idItem => parseInt(idItem));
      let result = await TaiSan.deleteMany({ ts_id: { $in: idArraya }, id_cty: com_id });
      if (result.deletedCount === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để xóa', 400);
      }
      return functions.success(res, 'xóa thành công!');
    } else if (type == 0) {
      // thay đổi trạng thái là 1
      let idArray = ts_id.map(idItem => parseInt(idItem));
      let result = await TaiSan.updateMany(
        { ts_id: { $in: idArray },ts_da_xoa: 0,id_cty : com_id },
        { ts_da_xoa: 1,
         ts_id_ng_xoa : ts_id_ng_xoa,
         ts_date_delete : deleteDate,

        }
      );
      if (result.nModified === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'Bạn đã xóa thành công , hiện vào danh sách dã xóa !');
    } else if (type == 2) {
      // Khôi phục tài sản
      let idArray = ts_id.map(idItem => parseInt(idItem));
      let result = await TaiSan.updateMany(
        { ts_id: { $in: idArray }, 
        ts_da_xoa: 1,id_cty : com_id  },
        { ts_da_xoa: 0 ,
          ts_id_ng_xoa : 0,
          ts_date_delete : 0,}
      );
      if (result.nModified === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'Bạn đã khôi phục tài sản thành công!');
    } else {
      return functions.setError(res, 'không thể thực thi!', 400);
    }
  } catch (e) {
    return functions.setError(res, e.message);
  }
};

exports.editTS = async (req, res) => {
  try {
    let {ts_vi_tri,
      ts_ten,ts_don_vi,ts_id,
      id_loai_ts,ts_so_luong,
      id_ten_quanly,id_dv_quanly,
      ts_gia_tri,ts_trangthai,
      } = req.body;
   
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const validationResult = quanlytaisanService.validateinputEdit(ts_ten, ts_don_vi, id_dv_quanly, id_ten_quanly,id_loai_ts,ts_vi_tri,ts_so_luong,ts_gia_tri,ts_trangthai);
    if(validationResult == true) {
      let chinhsua = await TaiSan.findOneAndUpdate(
        { ts_id: ts_id, id_cty: com_id ,ts_da_xoa : 0},
        {
          $set: {
            ts_ten: ts_ten,
            ts_don_vi: ts_don_vi,
            id_dv_quanly: id_dv_quanly,
            id_ten_quanly: id_ten_quanly,
            id_loai_ts : id_loai_ts,
            ts_vi_tri : ts_vi_tri,
            ts_so_luong : ts_so_luong,
            ts_gia_tri : ts_gia_tri,
            ts_trangthai : ts_trangthai,
          }
        },
        { new: true }
      );
      if (!chinhsua) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'get data success', { chinhsua });
    }
  }  catch(e){
    return functions.setError(res , e.message)
}
};
//hiển thị ghi tang
exports.showGhiTang = async(req,res) => {
  try{
   let {ts_id} = req.body;
   let com_id = '';
   if (req.user.data.type == 1 || req.user.data.type == 2) {
    com_id = req.user.data.com_id;
  } else {
    return functions.setError(res, 'không có quyền truy cập', 400);
  }
  if (typeof ts_id === 'undefined') {
    return functions.setError(res, 'id tài sản không được bỏ trống', 400);
  }
  if (isNaN(Number(ts_id))) {
    return functions.setError(res, 'id tài sản phải là một số', 400);
  }
  let checkGhiTang = await GhiTang.findOne({
    id_ts : ts_id, com_id : com_id
  })
  if (!checkGhiTang) {
    return functions.setError(res, 'Biên bản ghi tăng không tồn tại', 400);
  }
  let checkNguoiTao = await User.findOne({ idQLC: checkGhiTang.id_ng_tao, $or: [
    { 'inForPerson.employee.com_id': com_id },
    { idQLC: com_id }
  ] }).select('userName');
  if(!checkNguoiTao){
    checkNguoiTao = "";
  }
  let checkNguoiDuyet = await User.findOne({ idQLC: checkGhiTang.id_ng_duyet, $or: [
    { 'inForPerson.employee.com_id': com_id },
    { idQLC: com_id }
  ] }).select('userName');
  if(!checkNguoiDuyet){
    checkNguoiDuyet = "";
  }
  let checkTaiSan = await TaiSan.findOne({ts_id : ts_id,id_cty : com_id }).select('ts_ten')
  if (!checkTaiSan) {
    checkTaiSan = 0;
  }
   let items = [
    {
      so_bien_ban : checkGhiTang.id_ghitang,
      nguoi_tao : checkNguoiTao,
      ngay_tao : checkGhiTang.day_tao,
      nguoi_duyet : checkNguoiDuyet,
      trang_thai : checkGhiTang.trang_thai_ghi_tang,
      ngay_duyet : checkGhiTang.day_duyet,
      ma_tai_san : ts_id,
      ten_tai_san : checkTaiSan,
      so_luong_tang : checkGhiTang.sl_tang,
      ghi_chu : checkGhiTang.gt_ghi_chu
    }
   ]

   return functions.success(res, 'get data success', { items });
  } catch(e){
    console.log(e)
    return functions.setError(res , e.message)
}
}
// duyệt ghi tăng
exports.duyetHuyGhiTang = async(req,res) => {
  try{
    let {id_ghitang,type,lydo_tu_choi} = req.body;
    let com_id = '';
    let id_nguoi_duyet = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      id_nguoi_duyet = req.user.data.idQLC
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const createDate = Math.floor(Date.now() / 1000);
    let maxIdThongBao = await functions.getMaxIdByField(ThongBao, 'id_tb');
    let checkGhiTang = await GhiTang.findOne({id_ghitang : id_ghitang,com_id : com_id,xoa_ghi_tang : 0})
    if (typeof id_ghitang === 'undefined') {
      return functions.setError(res, 'id ghi tăng không được bỏ trống', 400);
    }
    if (isNaN(Number(id_ghitang))) {
      return functions.setError(res, 'id ghi tăng phải là một số', 400);
    }
    if(type == 1){
      //Duyệt ghi tăng
      let duyetGhiTang = await GhiTang.findOneAndUpdate(
        { id_ghitang : id_ghitang, com_id : com_id ,xoa_ghi_tang : 0},
        {
          $set: {
            id_ng_duyet : id_nguoi_duyet,
            trang_thai_ghi_tang : 3,
            day_duyet: createDate,
          }
        },
        { new: true }
      );
      if (!duyetGhiTang) {
        return functions.setError(res, 'Không tìm thấy bản ghi để duyệt', 400);
      }
      let createThongBao = new ThongBao({
        id_tb: maxIdThongBao,
        id_cty: com_id,
        id_ng_nhan : checkGhiTang.id_ng_tao,
        id_ng_tao : id_nguoi_duyet,
        loai_tb: 2,
        date_create : createDate
      
      })
      let saveTSVT = await createThongBao.save()
      let checkTaiSan = await TaiSan.findOne({
        ts_id : checkGhiTang.id_ts, id_cty : com_id
      }).select('ts_so_luong')
      let soluongmoi = checkTaiSan.ts_so_luong + checkGhiTang.sl_tang
      let updateTaiSan = await TaiSan.findOneAndUpdate({
        ts_id : checkGhiTang.id_ts,
        id_cty : com_id},
        {
          $set: {
            ts_so_luong : soluongmoi
          }
        },
        { new: true }
      )
      if (!updateTaiSan) {
        return functions.setError(res, 'Không tìm thấy bản ghi tài sản để cộng số lương', 400);
      }
  
      return functions.success(res, 'duyệt thành công ', { duyetGhiTang,saveTSVT });
    }
    else if(type == 2){
      //từ chối ghi tăng
      let tuchoiGhiTang =  await GhiTang.findOneAndUpdate(
        { id_ghitang : id_ghitang, com_id : com_id ,xoa_ghi_tang : 0},
        {
          $set: {
            id_ng_duyet : id_nguoi_duyet,
            trang_thai_ghi_tang : 2,
            lydo_tu_choi : lydo_tu_choi,
            day_duyet: createDate,
          }
        },
        { new: true }
      );
      if (!tuchoiGhiTang) {
        return functions.setError(res, 'Không tìm thấy bản ghi để từ chối', 400);
      }
      // let createThongBao = new ThongBao({
      //   id_tb: maxIdThongBao,
      //   id_cty: com_id,
      //   id_ng_nhan : checkGhiTang.id_ng_tao,
      //   id_ng_tao : id_nguoi_duyet,
      //   loai_tb: 2,
      //   date_create : createDate
      
      // })
      // let saveTSVT = await createThongBao.save()
      return functions.success(res, 'từ chối  thành công ', { tuchoiGhiTang });
    }else {
      return functions.setError(res, 'type xử lý không hợp lệ', 400);
    }
  }catch(e){
    console.log(e)
    return functions.setError(res , e.message)
}
}
// xóa ghi tăng
exports.XoaGhiTang = async(req,res) => {
  try {
    let { type, id_ghitang} = req.body;
    let com_id = '';
    let id_ng_xoa = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      id_ghitang = req.user.data.idQLC;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const deleteDate = Math.floor(Date.now() / 1000);
    if (!id_ghitang.every(num => !isNaN(parseInt(num)))) {
      return functions.setError(res, 'id_ghitang không hợp lệ', 400);
    }
    if (type == 1) { // xóa vĩnh viễn
      let idArraya = id_ghitang.map(idItem => parseInt(idItem));
      let result = await GhiTang.deleteMany({ id_ghitang: { $in: idArraya }, com_id: com_id });
      if (result.deletedCount === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để xóa', 400);
      }
      return functions.success(res, 'xóa thành công!');
    } else if (type == 0) {
      // thay đổi trạng thái là 1
      let idArray = id_ghitang.map(idItem => parseInt(idItem));
      let result = await GhiTang.updateMany(
        { id_ghitang: { $in: idArray },xoa_ghi_tang: 0,com_id : com_id },
        { xoa_ghi_tang: 1,
          id_ng_xoa : id_ng_xoa,
         day_xoa : deleteDate,

        }
      );
      if (result.nModified === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'Bạn đã xóa thành công , hiện vào danh sách dã xóa !');
    } else if (type == 2) {
      // Khôi phục ghi tăng
      let idArray = id_ghitang.map(idItem => parseInt(idItem));
      let result = await GhiTang.updateMany(
        { id_ghitang: { $in: idArray }, 
        xoa_ghi_tang: 1,com_id : com_id  },
        { xoa_ghi_tang: 0 ,
          id_ng_xoa : 0,
          day_xoa : 0,}
      );
      if (result.nModified === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'Bạn đã khôi phục ghi tăng thành công!');
    } else {
      return functions.setError(res, 'không thể thực thi!', 400);
    }
  } catch (e) {
    return functions.setError(res, e.message);
  }
}
// thêm ghi tăng
exports.addGhiTang  = async(req,res) => {
  try{
    let {ts_id,sl_tang,ghi_chu} = req.body
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      id_nguoi_tao = req.user.data.idQLC
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let maxIdGhiTang = await functions.getMaxIdByField(GhiTang, 'id_ghitang');
    let maxIdThongBao = await functions.getMaxIdByField(ThongBao, 'id_tb');
    let maxIdQTSD = await functions.getMaxIdByField(QuaTrinhSuDung, 'quatrinh_id');
    const createDate = Math.floor(Date.now() / 1000);
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài sản phải là một số', 400);
    }
    if (typeof sl_tang === 'undefined') {
      return functions.setError(res, 'số lương tăng không được bỏ trống', 400);
    }
    if (isNaN(Number(sl_tang))) {
      return functions.setError(res, 'số lượng tăng phải là một số', 400);
    }
    let createGt = new GhiTang({
      id_ghitang : maxIdGhiTang,
      id_ts: ts_id,
      sl_tang : sl_tang,
      id_ng_tao : id_nguoi_tao,
      ghi_chu: ghi_chu,
      day_tao : createDate
    
    })
    let saveGT = await createGt.save()
    let createQTSD = new QuaTrinhSuDung({
      quatrinh_id: quatrinh_id,
      id_bien_ban: saveGT.id_ghitang,
      so_lg : saveGT.sl_tang,
      id_cty : com_id,
      id_cty_sudung: com_id,
      qt_ngay_thuchien : saveGT.day_tao,
      qt_nghiep_vu : 9,
      ghi_chu : ghi_chu,
      time_created : createDate
    })
    let saveQTSD = await createQTSD.save()
    let createThongBao = new ThongBao({
      id_tb: maxIdThongBao,
      id_cty: com_id,
      id_ng_nhan : id_ng_tao,
      id_ng_tao : com_id,
      loai_tb: 2,
      date_create : createDate
    })
    let saveTSVT = await createThongBao.save()
    return functions.success(res, 'chỉnh sửa thành công ', { saveGT,saveQTSD,saveTSVT });
  } catch (e) {
    return functions.setError(res, e.message);
  }
}
//sửa ghi tăng
exports.chinhSuaGhitang = async(req,res) => {
    try{
      let {id_ghitang,sl_tang,gt_ghi_chu} = req.body;
      if (req.user.data.type == 1 || req.user.data.type == 2) {
        com_id = req.user.data.com_id;
        id_nguoi_duyet = req.user.data.idQLC
      } else {
        return functions.setError(res, 'không có quyền truy cập', 400);
      }
      if (typeof id_ghitang === 'undefined') {
        return functions.setError(res, 'id ghi tăng không được bỏ trống', 400);
      }
      if (isNaN(Number(id_ghitang))) {
        return functions.setError(res, 'id ghi tăng phải là một số', 400);
      }
      if (typeof sl_tang === 'undefined') {
        return functions.setError(res, 'số lương tăng không được bỏ trống', 400);
      }
      if (isNaN(Number(sl_tang))) {
        return functions.setError(res, 'số lượng tăng phải là một số', 400);
      }
      let chinhsuaGhiTang = await GhiTang.findOneAndUpdate(
        { id_ghitang : id_ghitang, com_id : com_id ,xoa_ghi_tang : 0},
        {
          $set: {
            sl_tang : sl_tang,
            gt_ghi_chu : gt_ghi_chu,
          }
        },
        { new: true }
      );
      if (!chinhsuaGhiTang) {
        return functions.setError(res, 'Không tìm thấy bản ghi để chỉnh sửa', 400);
      }
      return functions.success(res, 'chỉnh sửa thành công ', { chinhsuaGhiTang });

    }catch(e){
    console.log(e)
    return functions.setError(res , e.message)
}
}



exports.quatrinhsd = async (req, res) => {
  try {

    let { ts_id, page, perPage,qt_nghiep_vu } = req.body;
    let com_id = '';
    page = page || 1;
    perPage = perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài sản phải là một số', 400);
    }
    const searchCondition = {};
    if (qt_nghiep_vu) {
      searchCondition.qt_nghiep_vu = qt_nghiep_vu;
    }
    let listQTSD = await QuaTrinhSuDung.find({id_ts : ts_id,id_cty : com_id,
      ...searchCondition})
    let items = [];
    for (const qt of listQTSD) {
      let listCP = [];
      let listTH = [];
      let listDC = [];
      let listSC = [];
      let listBD = [];
      let listM = [];
      let listH = [];
      let listTL = [];
      let listGT = [];
      let trangThaiMap = {};
      switch (qt.qt_nghiep_vu) {
        case 1:
          listCP = await CapPhat.find({ cp_id: qt.id_bien_ban, id_cty: com_id, cp_da_xoa: 0 });
          for(let i = 0; i < listCP.length;i++){
            trangThaiMap[qt.id_bien_ban] = listCP[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 1
          break;
        case 2:
          listTH = await ThuHoi.find({ thuhoi_id: qt.id_bien_ban, id_cty: com_id, xoa_thuhoi: 0 });
          for(let i = 0; i < listTH.length;i++){
            trangThaiMap[qt.id_bien_ban] = listTH[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 2
          break;
        case 3:
          listDC = await DieuChuyen.find({ dc_id: qt.id_bien_ban, id_cty: com_id, xoa_dieuchuyen: 0 });
          for(let i = 0; i < listDC.length;i++){
            trangThaiMap[qt.id_bien_ban] = listDC[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 3
          break;
        case 4:
          listSC = await SuaChua.find({ sc_id: qt.id_bien_ban, id_cty: com_id, sc_da_xoa: 0 });
          for(let i = 0; i < listSC.length;i++){
            trangThaiMap[qt.id_bien_ban] = listSC[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 4
          break;
        case 5:
          listBD = await BaoDuong.find({ id_bd: qt.id_bien_ban, id_cty: com_id, xoa_bd: 0 });
          for(let i = 0; i < listBD.length;i++){
            trangThaiMap[qt.id_bien_ban] = listBD[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 5
          break;
        case 6:
          listM = await Mat.find({ mat_id: qt.id_bien_ban, id_cty: com_id, xoa_dx_mat: 0 });
          for(let i = 0; i < listM.length;i++){
            trangThaiMap[qt.id_bien_ban] = listM[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 6
          break;
        case 7:
          listH = await Huy.find({ huy_id: qt.id_bien_ban, id_cty: com_id, xoa_huy: 0 });
          for(let i = 0; i < listH.length;i++){
            trangThaiMap[qt.id_bien_ban] = listH[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 7
          break;
        case 8:
          listTL = await ThanhLy.find({ tl_id: qt.id_bien_ban, id_cty: com_id, xoa_dx_tl: 0 });
          for(let i = 0; i < listTL.length;i++){
            trangThaiMap[qt.id_bien_ban] = listTL[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 8
          break;
        case 9:
          listGT = await CapPhat.find({ id_ghitang: qt.id_bien_ban, com_id: com_id, xoa_ghi_tang: 0 });
          for(let i = 0; i < listGT.length;i++){
            trangThaiMap[qt.id_bien_ban] = listGT[i].cp_trangthai;
          }
          // Xử lý khi qt_nghiep_vu là 9
          break;
        default:
          // Xử lý khi qt_nghiep_vu không thuộc các case trên
          break;
      }
      
      items.push({
        so_bien_ban: qt.id_bien_ban,
        ngay_thuc_hien : qt.qt_ngay_thuchien,
        nghiep_vu : qt.qt_nghiep_vu,
        trang_thai :  trangThaiMap[qt.id_bien_ban],
        vi_tri_tai_san : qt.vitri_ts,
        nguoi_su_dung : qt.id_ng_sudung,
        ghi_chu : qt.ghi_chu
      });
    }
    const totalItems = await QuaTrinhSuDung.countDocuments({
      id_ts: ts_id,
      id_cty: com_id,
      ...searchCondition // Áp dụng điều kiện tìm kiếm theo nghiệp vụ (nếu có) để tính tổng số bản ghi
    });
    const totalPages = Math.ceil(totalItems / perPage);
    const hasNextPage = endIndex < totalItems;

    return functions.success(res, 'get data success', {
      items,
      totalPages,
      hasNextPage
    });
    // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
    return functions.success(res, 'get data success', { items});
  }  catch(e){
    console.log(e)
    return functions.setError(res , e.message)
}
};


//Phần Khấu hao
exports.khauhaoCTTS = async (req, res) => {
  try {
    let { id_ts } = req.body;
    let com_id = '';

    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }

    let checkTaisan = await TaiSan.findOne({ id_ts, id_cty: com_id });
    let ngay_co_ts = checkTaisan.ts_date_create - 86400;

    let checkKhauHao = await KhauHao.findOne({ kh_id_cty: com_id, kh_id_ts: id_ts });

    if (checkKhauHao) {
      let type_kh = '';
      let gt_kh = serviceQLTS.numberWithCommas(checkKhauHao.gt_kh) + " VNĐ";
      let kh_so_ky = checkKhauHao.kh_so_ky;
      let kh_day_start = checkKhauHao.kh_day_start;
      let kh_so_ky_con_lai = checkKhauHao.$kh_so_ky_con_lai;
      let kh_gt_da_kh = serviceQLTS.numberWithCommas(checkKhauHao.kh_gt_da_kh) + " VNĐ";
      let kh_gt_cho_kh = serviceQLTS.numberWithCommas(checkKhauHao.kh_gt_cho_kh) + " VNĐ";

      if (checkKhauHao.kh_type_ky == 0) {
        type_kh = 'Ngày';
      } else if (checkKhauHao.kh_type_ky == 1) {
        type_kh = 'Tháng';
      } else if (checkKhauHao.kh_type_ky == 2) {
        type_kh = 'Năm';
      }

      let khauHao = {
        gt_kh,
        kh_so_ky,
        kh_day_start,
        kh_so_ky_con_lai,
        kh_gt_da_kh,
        kh_gt_cho_kh,
        type_kh
      };

      return functions.success(res, 'get data success', { khauHao });
    } else {
      let gt_kh = 'Chưa cập nhật';
      let kh_so_ky = 'Chưa cập nhật';
      let kh_day_start = 'Chưa cập nhật';
      let kh_so_ky_con_lai = 'Chưa cập nhật';
      let kh_gt_da_kh = 'Chưa cập nhật';
      let kh_gt_cho_kh = 'Chưa cập nhật';

      let khauHao = {
        gt_kh,
        kh_so_ky,
        kh_day_start,
        kh_so_ky_con_lai,
        kh_gt_da_kh,
        kh_gt_cho_kh
      };

      return functions.success(res, 'get data success', { khauHao });
    }
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
};
//thêm khấu hao
exports.addKhauHao = async(req,res) => {
  try{
    let {ts_id,kh_gt,kh_so_ky,kh_so_ky_con_lai,kh_day_start,kh_gt_cho_kh} = req.body
    let com_id = '';
    const createDate = Math.floor(Date.now() / 1000);
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    
    if(!kh_gt || !kh_so_ky || !kh_so_ky_con_lai || !kh_day_start ||kh_gt_cho_kh) {
       functions.setError(res, 'thiếu thông tin truyền lên', 400)
    }
    let checkts = await TaiSan.findOne({ts_id : ts_id,com_id : com_id}).select('ts_date_create')
    if(checkts.ts_date_create > kh_day_start ) {
      functions.setError(res, 'Ngày bắt đầu khấu hao không thể trước ngày thêm tài sản!', 400)
    }
    let checkkh = await KhauHao.findOne({kh_id_ts : ts_id, kh_id_cty : com_id})
    if(checkkh) {
      let chinhsua = await KhauHao.findOneAndUpdate(
        { kh_id_ts : ts_id, id_kh_id_cty : com_id},
        {
          $set: {
            kh_gt: kh_gt,
            kh_so_ky: kh_so_ky,
            kh_type_ky: kh_type_ky,
            kh_so_ky_con_lai: kh_so_ky_con_lai,
            kh_gt_cho_kh : kh_gt_cho_kh,
            kh_day_start : kh_day_start,
          }
        },
        { new: true }
      );
      if (!chinhsua) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'get data success', { chinhsua });
    }
    else {
      let maxIdKhauhao = await functions.getMaxIdByField(KhauHao, 'id_khau_hao');
       let newKh = new KhauHao({
        id_khau_hao : maxIdKhauhao,
        kh_id_cty : com_id,
        kh_id_ts : ts_id,
        kh_gt : kh_gt,
        kh_so_ky : kh_so_ky,
        kh_type_ky : kh_type_ky,
        kh_so_ky_con_lai : kh_so_ky_con_lai,
        kh_gt_cho_kh : kh_gt_cho_kh,
        kh_day_start : kh_day_start,
        kh_day_create : createDate
      })
      let save = await newKh.save();
      return functions.success(res, 'thêm thành công tệp', { save });
    }
  }catch(e){
    console.log(e)
    return functions.setError(res , e.message)
}
}

// Phần tài liệu đính kèm
exports.addFile = async (req, res) => {
  try {
    let { ts_id } = req.body;
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let createDate = Math.floor(Date.now() / 1000);
    let tep_dinh_kem = req.files.tep_ten;
    if (tep_dinh_kem) {
      let checkFile = await functions.checkFile(tep_dinh_kem.path);
      if (!checkFile) {
        return functions.setError(res, `File khong dung dinh dang hoac qua kich cho phep!`, 411);
      }
      fileName = tep_dinh_kem.name
    }
    let maxIdTep = await functions.getMaxIdByField(TepDinhKem, 'tep_id');
    let createNew = new TepDinhKem({
      tep_id: maxIdTep,
      id_cty: com_id,
      id_ts: ts_id,
      tep_ten: fileName,
      tep_ngay_upload: createDate,
    })
    let save = await createNew.save();
    return functions.success(res, 'thêm thành công tệp', { save });
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}

exports.showFile = async (req, res) => {
  try {
    let { ts_id, page, perPage } = req.body;
    let com_id = '';
    page = page || 1;
    perPage = perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài sản phải là một số', 400);
    }
    let showtep = await TepDinhKem.find({ id_ts: ts_id,id_cty : com_id })
      .sort({ tep_id: -1 })
      .skip(startIndex)
      .limit(perPage);
    const totalTsCount = await TepDinhKem.countDocuments({ id_cty: com_id, id_ts: ts_id });

    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = endIndex < totalTsCount;
    return functions.success(res, 'get data success', { showtep, totalPages, hasNextPage });

  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}

exports.deleteFile = async (req, res) => {
  try {
    let { tep_id } = req.body;
    if (typeof tep_id === 'undefined') {
      return functions.setError(res, 'id tệp đính kèm không được bỏ trống', 400);
    }
    if (isNaN(Number(tep_id))) {
      return functions.setError(res, 'id tệp phải là một số', 400);
    }
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    await TepDinhKem.deleteOne({ tep_id: tep_id, id_cty: com_id })
    return functions.success(res, 'xóa tiệp thành công');
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}

// Phần  Sửa chữa theo id tài sản

exports.showScCT = async (req, res) => {
  try {
    let { ts_id, page, perPage } = req.body;
    let com_id = '';
    page = page || 1;
    perPage = perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài sản phải là một số', 400);
    }
    let listSCCT = await SuaChua.find({ suachua_taisan: ts_id, id_cty: com_id })
      .select('id_sc sc_trangthai sc_ngay sc_dukien sc_hoanthanh sc_chiphi_dukien sc_chiphi_thucte sc_nguoi_thuchien sc_donvi')
      .sort({ sc_id: -1 })
      .skip(startIndex)
      .limit(perPage);
    const totalTsCount = await SuaChua.countDocuments({ id_cty: com_id, suachua_taisan: ts_id });

    // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = endIndex < totalTsCount;
    return functions.success(res, 'get data success', { listSCCT, totalPages, hasNextPage });
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}

//Phần Bảo dưỡng theo id tài sản
exports.showBDCT = async (req, res) => {
  try {
    let { ts_id, page, perPage } = req.body;
    let com_id = '';
    page = page || 1;
    perPage = perPage || 10;
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài sản phải là một số', 400);
    }
    let listBDCT = await BaoDuong.find({ baoduong_taisan: ts_id, id_cty: com_id })
      .select('id_bd bd_trang_thai bd_ngay_batdau bd_dukien_ht bd_ngay_ht bd_chiphi_dukien bd_chiphi_thucte bd_nguoi_thuchien donvi_bd')
      .sort({ id_bd: -1 })
      .skip(startIndex)
      .limit(perPage);
    const totalTsCount = await BaoDuong.countDocuments({ id_cty: com_id, baoduong_taisan: ts_id });
    // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = endIndex < totalTsCount;
    return functions.success(res, 'get data success', { listBDCT, totalPages, hasNextPage });
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}

//Phần thông tin phân bổ
exports.showTTPB = async (req, res) => {
  try {
    let { ts_id,type} = req.body;
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài sản phải là một số', 400);
    }
    let showPb = await PhanBo.findOne({ id_ts: ts_id, id_cty: com_id })
    return functions.success(res, 'get data success', { showPb });
  } catch (error) {
    console.error('Failed ', error);
    return functions.setError(res, error);
  }
}