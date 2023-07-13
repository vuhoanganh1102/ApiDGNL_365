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
    let { page, perPage, ts_ten, id_nhom_ts, ts_vi_tri, id_ten_quanly, ts_trangthai } = req.body;
    let com_id = '';
    
    page = parseInt(page) || 1; // Trang hiện tại (mặc định là trang 1)
    perPage = parseInt(perPage) || 10; // Số lượng bản ghi trên mỗi trang (mặc định là 10)
     
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
    } else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    // Tính toán startIndex và endIndex
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    let matchQuery = {
      id_cty: com_id,// Lọc theo com_id
      ts_da_xoa : 0 
    };

    if (ts_ten) {
      matchQuery.ts_ten = { $regex: ts_ten, $options: "i" };
    }
    if (id_nhom_ts) {
      matchQuery.id_nhom_ts = parseInt(id_nhom_ts);
    }
    if (ts_vi_tri) {
      matchQuery.ts_vi_tri = parseInt(ts_vi_tri);;
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
      {
        $lookup: {
          from: 'QLTS_Loai_Tai_San', // Tên bảng khác bạn muốn tham gia
          localField: 'id_loai_ts',
          foreignField: 'id_loai',
          as: 'name_loai',
        },
      },
      {
        $lookup: {
          from: 'QLTS_ViTri_ts', // Tên bảng khác bạn muốn tham gia
          localField: 'ts_vi_tri',
          foreignField: 'id_vitri',
          as: 'name_vitri',
        },
      }
      ,
      {
        $skip: startIndex, // Bỏ qua các bản ghi từ startIndex
      },
      {
        $limit: perPage, // Giới hạn số lượng bản ghi trả về là perPage
      },
    ])

    // Lấy tổng số lượng tài sản
    const totalTsCount = await TaiSan.countDocuments(matchQuery);

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
    let { datatype, ts_id, type_quyen } = req.body;

    let com_id = '';
    let ts_id_ng_xoa = req.user.data.idQLC;
    const deleteDate = Math.floor(Date.now() / 1000);
    if (typeof ts_id === 'undefined') {
      return functions.setError(res, 'id tài sản không được bỏ trống', 400);
    }
    if (isNaN(Number(ts_id))) {
      return functions.setError(res, 'id tài sản phải là một số', 400);
    }
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
    } 
    else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập');
    }
    if (datatype == 1) {
      let chinhsua = await TaiSan.findOneAndUpdate({ ts_id: ts_id, id_cty: com_id },
        {
          $set: {
            ts_da_xoa: 1,
            ts_type_quyen_xoa: type_quyen,
            ts_id_ng_xoa : ts_id_ng_xoa,
            ts_date_delete: deleteDate
          }
        }, { new: true }
      )
      return functions.success(res, 'get data success', { chinhsua });
    }
    if (datatype == 2) {
      let khoiphuc = await TaiSan.findOneAndUpdate({ ts_id: ts_id, id_cty: com_id },
        {
          $set: {
            ts_da_xoa: 0,
            ts_type_quyen_xoa: 0,
            ts_id_ng_xoa: 0,
            ts_date_delete: 0
          }
        }, { new: true }
      )
      return functions.success(res, 'get data success', { khoiphuc });
    }
    if (datatype == 3) {
      await TaiSan.findOneAndDelete({ ts_id: ts_id, id_cty: com_id })
      return functions.success(res, 'thanh cong');
    } else {
      return functions.setError(res, 'không có quyền xóa', 400)
    }

  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
}


exports.editTS = async (req, res) => {
  try {
    let { ts_id,id_loai_ts_edit, ts_gia_tri_edit,ts_trangthai_edit,
      ts_ten_edit,ts_so_luong_edit,ts_don_vi_edit,ts_vi_tri_edit,
      ghi_chu_edit,don_vi_tinh_edit,id_ten_quanly_edit
    } = req.body;
    let com_id = '';
   
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
    } else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }

    let checkTs = await TaiSan.find({ id_cty: com_id })
    if (checkTs.some(ts => ts.ts_ten === ts_ten)) {
      return functions.setError(res, 'tên tài sản  đã được sử dụng', 400);
    } else {
      let chinhsua = await TaiSan.findOneAndUpdate(
        {ts_id: ts_id,id_cty : com_id },
        { $set: { ts_ten: ts_ten_edit,
                  id_loai_ts : id_loai_ts_edit,
                  ts_gia_tri : ts_gia_tri_edit,
                  ts_trangthai : ts_trangthai_edit,
                  } },
        { new: true }
      );

      return functions.success(res, 'get data success', { chinhsua});
    }
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};