const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const NhomTaiSan = require('../../models/QuanLyTaiSan/NhomTaiSan');
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const quanlytaisanService = require('../../services/QLTS/qltsService');
const PhanQuyen = require('../../models/QuanLyTaiSan/PhanQuyen')
const functions = require('../../services/functions')


exports.addNhomTaiSan = async (req, res) => {
  try {
    let { ten_nhom } = req.body;
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let createDate = Math.floor(Date.now() / 1000);
    if (typeof ten_nhom === 'undefined') {
      return functions.setError(res, 'tên nhóm  không được bỏ trống', 400);
    } else {
      let checkNhom = await NhomTaiSan.find({ id_cty: com_id })
      if (checkNhom.some(nhom => nhom.ten_nhom === ten_nhom)) {
        return functions.setError(res, 'ten_nhom đã được sử dụng', 400);
      }
      else {
        let maxID = await quanlytaisanService.getMaxIDnhom(NhomTaiSan)
        let id_nhom = 0;
        if (maxID) {
          id_nhom = Number(maxID) + 1;
        }
        let createNew = new NhomTaiSan({
          id_nhom: id_nhom,
          ten_nhom: ten_nhom,
          id_cty: com_id,
          nhom_date_create: createDate
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

exports.showNhomTs = async (req, res) => {
  try {
    let com_id = '';
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }

    // Trích xuất id_nhom, page và perPage từ req.body
    let { id_nhom, page, perPage } = req.body;
    page = parseInt(page) || 1; // Trang hiện tại (mặc định là trang 1)
    perPage = parseInt(perPage) || 10; // Số lượng bản ghi trên mỗi trang (mặc định là 10)

    let matchQuery = {
      id_cty: com_id 
      
    };
    if (id_nhom) {
      const parsedIdNhom = parseInt(id_nhom);
      if (!isNaN(parsedIdNhom)) {
        matchQuery.$or = [{ id_nhom_ts: parsedIdNhom }, { id_nhom: parsedIdNhom }];
       
    // Thêm điều kiện $nin để loại bỏ những id_nhom đã có
   
      } else {
        // Xử lý trường hợp id_nhom không phải là số hợp lệ
        return functions.setError(res, 'id_nhom không hợp lệ', 400);
      }
    }
    // Đếm số lượng ts_id dựa trên giá trị id_nhom_ts và gom nhóm theo id_nhom_ts
    const countTs = await TaiSan.aggregate([
      {
        $match: { ...matchQuery, ts_da_xoa: 0 },
      },
      {
        $group: {
          _id: '$id_nhom_ts',
          totalTsId: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalTsId: -1,
        },
      },
    ]);
    const countloai = await LoaiTaiSan.aggregate([
      {
        $match: { ...matchQuery, loai_da_xoa: 0 },
      },
      {
        $group: {
          _id: '$id_nhom_ts',
          totalloaiId: { $sum: 1 },
        },
      },
      {
        $sort: {
          totalloaiId: -1,
        },
      },
    ]);
   let nhomTsInfo = await NhomTaiSan.aggregate([
      {
        $match: { ...matchQuery,nhom_da_xoa : 0 },
      },
      {
        $project: {
          _id: 0,
          id_nhom: 1,
          ten_nhom: 1,
        },
      },
    ]);
    console.log(nhomTsInfo)
    const totalItems = countTs.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    // Lấy các kết quả phân trang
    const pagedCountTs = countTs.slice(startIndex, endIndex);
    const pagedCountLoai = countloai.slice(startIndex, endIndex);
    
    return functions.success(res, 'get data success', { nhomTsInfo,countloai,countTs, totalPages });
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};

exports.showCTNhomTs = async (req, res) => {
  try {
    let { id, page, perPage } = req.body;
    let com_id = '';
    if (req.user.data.type == 1|| req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    page = page || 1;
    perPage = perPage || 10;
    let query = {
      loai_da_xoa: 0,
    };
    
    const showdetails = await LoaiTaiSan.find({ id_nhom_ts: id, id_cty: com_id, ...query })
      .sort({ id_loai: -1 })
      .skip(startIndex)
      .limit(perPage);

    if (showdetails.length === 0) {
      return functions.success(res, 'get data success', { showdetails: [], totalPages: 0, hasNextPage: false });
    }

    const idTaisan = showdetails.map(item => item.id_loai);

    const showtaisan = await TaiSan.find({ id_loai_ts: { $in: idTaisan } }).select('ts_id ts_ten');

    // Chứa giá trị tương ứng của showtaisan với showdetails
    const showdetailsWithTaisan = showdetails.map(detail => {
      const matchingTaisan = showtaisan.find(taisan => taisan.ts_id.toString() === detail.id_loai.toString());
      return {
        ...detail.toObject(),
        taisan: matchingTaisan || null,
      };
    });


    const totalTsCount = await LoaiTaiSan.countDocuments({ id_nhom_ts: id, id_cty: com_id, ...query });
    // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
    const totalPages = Math.ceil(totalTsCount / perPage);
    const hasNextPage = endIndex < totalTsCount;
 
    return functions.success(res, 'get data success', { showdetails: showdetailsWithTaisan, totalPages, hasNextPage });

  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};
 


exports.editNhom = async (req, res) => {
  try {
    let { ten_nhom, id_nhom } = req.body;
    let com_id = '';
   
    if (req.user.data.type == 1|| req.user.data.type == 2) {
      com_id = req.user.data.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    let checkNhom = await NhomTaiSan.find({ id_cty: com_id })
    if (checkNhom.some(nhom => nhom.ten_nhom === ten_nhom)) {
      return functions.setError(res, 'ten_nhom đã được sử dụng', 400);
    } else {
      let chinhsuanhom = await NhomTaiSan.findOneAndUpdate(
        {id_nhom: id_nhom,id_cty : com_id },
        { $set: { ten_nhom: ten_nhom } },
        { new: true }
      );

      return functions.success(res, 'get data success', { chinhsuanhom });
    }
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};


exports.xoaNhom = async (req, res) => {
  try {
    let { datatype, id_nhom, type_quyen } = req.body;
    let com_id = '';
    let nhom_id_ng_xoa = '';
    if (req.user.data.type == 1|| req.user.data.type == 2) {
    com_id = req.user.data.com_id;
    nhom_id_ng_xoa = req.user.data.idQLC;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const deleteDate = Math.floor(Date.now() / 1000);
    if (typeof id_nhom === 'undefined') {
      return functions.setError(res, 'id nhóm không được bỏ trống', 400);
    }
    if (isNaN(Number(id_nhom))) {
      return functions.setError(res, 'id nhóm phải là một số', 400);
    }
    if (datatype == 1) {
      let chinhsuanhom = await NhomTaiSan.findOneAndUpdate({ id_nhom: id_nhom, id_cty: com_id },
        {
          $set: {
            nhom_da_xoa: 1,
            nhom_type_quyen_xoa: type_quyen,
            nhom_id_ng_xoa: nhom_id_ng_xoa,
            nhom_date_delete: deleteDate
          }
        }, { new: true }
      )
      return functions.success(res, 'get data success', { chinhsuanhom });
    }
    if (datatype == 2) {
      let khoiphuc = await NhomTaiSan.findOneAndUpdate({ id_nhom: id_nhom, id_cty: com_id },
        {
          $set: {
            nhom_da_xoa: 0,
            nhom_type_quyen_xoa: 0,
            nhom_id_ng_xoa: 0,
            nhom_date_delete: 0
          }
        }, { new: true }
      )
      return functions.success(res, 'get data success', { khoiphuc });
    }
    if (datatype == 3) {
      await NhomTaiSan.findOneAndDelete({ id_nhom: id_nhom, id_cty: com_id })
      return functions.success(res, 'thanh cong');
    } else {
      return functions.setError(res, 'không có quyền xóa', 400)
    }

  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
}