const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const quanlytaisanService = require('../../services/QLTS/qltsService');
const functions = require('../../services/functions')

exports.addLoaiTaiSan = async (req, res) => {
  try {
    let { ten_loai, id_nhom } = req.body;
    let com_id = '';
    let createDate = Math.floor(Date.now() / 1000);
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (typeof ten_loai === 'undefined') {
      return functions.setError(res, 'tên loại  không được bỏ trống', 400);
    }
    if (typeof id_nhom === 'undefined') {
      return functions.setError(res, 'id_nhom  không được bỏ trống', 400);
    }
    else {
      let checkLoai = await LoaiTaiSan.find({ id_cty: com_id })
      if (checkLoai.some(loai => loai.ten_loai === ten_loai)) {
        return functions.setError(res, 'tên loại  đã được sử dụng', 400);
      }
      else {
        let maxID = await quanlytaisanService.getMaxIDloai(LoaiTaiSan)
        let id_loai = 0;
        if (maxID) {
          id_loai = Number(maxID) + 1;
        }
        let createNew = new LoaiTaiSan({
          id_loai: id_loai,
          ten_loai: ten_loai,
          id_cty: com_id,
          id_nhom: id_nhom,
          loai_date_create: createDate
        })
        let save = await createNew.save()
        return functions.success(res, 'save data success', { save })
      }
    }

  } catch (error) {
    console.log(error);
    return functions.setError(res, error)
  }
}

exports.showLoaiTs = async (req, res) => {
  try {
    let { id_loai, page, perPage } = req.body
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    page = page || 1;
    perPage = perPage || 10;
    let matchQuery = {
      id_cty: com_id,// Lọc theo com_id
      loai_da_xoa : 0
    };
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    if (id_loai) {
      matchQuery.id_loai = parseInt(id_loai);;
    }
    const showLoaiTs = await LoaiTaiSan.aggregate([
      {
        match: matchQuery, 
      },
      {
        $lookup : {
          from: 'QLTS_Nhom_Tai_San',
          localField : 'id_nhom_ts',
          foreignField : 'id_loai',
          as : 'listNhom'
        }
      }, 
      {
        $skip: startIndex,
      },
      {
        $limit: perPage,
      }
      
    ])
    const totalTsCount = await LoaiTaiSan.countDocuments(matchQuery);

    // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = endIndex < totalTsCount;

    return functions.success(res, 'get data success', { showLoaiTs, totalPages, hasNextPage });
  } catch (error) {
    console.log(error);
    return functions.setError(res, error)
  }
}


exports.editLoaiTs = async (req, res) => {
  try {
    let { ten_loai, id_nhom, id_loai } = req.body;
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let checloai = await LoaiTaiSan.find({ id_cty: com_id })
    if (checloai.some(loai => loai.ten_loai === ten_loai)) {
      return functions.setError(res, 'tên loại đã được sử dụng', 400);
    } else {
      let chinhsualoai = await LoaiTaiSan.findOneAndUpdate(
        { id_loai: id_loai, id_cty: com_id },
        {
          $set: {
            id_nhom_ts: id_nhom,
            ten_loai: ten_loai
          }
        },
        { new: true }
      );

      return functions.success(res, 'edit data success', { chinhsualoai });
    }
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
}

exports.deleteLoaiTs = async (req, res) => {
  try {
    let { datatype, id, type_quyen } = req.body;
    let com_id = '';
    let id_ng_xoa = '';
    
    const deleteDate = Math.floor(Date.now() / 1000);
    if (typeof id === 'undefined') {
      return functions.setError(res, 'id nhóm không được bỏ trống', 400);
    }
    if (isNaN(Number(id))) {
      return functions.setError(res, 'id nhóm phải là một số', 400);
    }
    if (req.user.data.type == 1|| req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      id_ng_xoa = req.user.data.idQLC;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (datatype == 1) {
      let chinhsualoai = await LoaiTaiSan.findOneAndUpdate({ id_loai: id, id_cty: com_id },
        {
          $set: {
            loai_da_xoa: 1,
            loai_type_quyen_xoa: type_quyen,
            id_ng_xoa: id_ng_xoa,
            loai_date_delete: deleteDate
          }
        }, { new: true }
      )
      return functions.success(res, 'get data success', { chinhsualoai });
    }
    if (datatype == 2) {
      let khoiphuc = await LoaiTaiSan.findOneAndUpdate({ id_loai: id, id_cty: com_id },
        {
          $set: {
            loai_da_xoa: 0,
            loai_type_quyen_xoa: 0,
            id_ng_xoa: 0,
            loai_date_delete: 0
          }
        }, { new: true }
      )
      return functions.success(res, 'get data success', { khoiphuc });
    }
    if (datatype == 3) {
      await LoaiTaiSan.findOneAndDelete({ id_loai: id, id_cty: com_id })
      return functions.success(res, 'thanh cong');
    } else {
      return functions.setError(res, 'không có quyền xóa', 400)
    }

  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
}

