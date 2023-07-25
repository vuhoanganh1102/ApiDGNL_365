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
    page = parseInt(page) || 1; // Trang hiện tại (mặc định là trang 1)
    perPage = parseInt(perPage) || 10; // Số lượng bản ghi trên mỗi trang (mặc định là 10)
    if (req.user.data.type == 1 || req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      console.log(com_id)
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;
    let matchQuery = {
      id_cty : com_id,// Lọc theo com_id
      loai_da_xoa: 0
    };
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
    let { type, id_nhom } = req.body;
    let com_id = '';
    let nhom_id_ng_xoa = '';
    
    const deleteDate = Math.floor(Date.now() / 1000);
    if (req.user.data.type == 1|| req.user.data.type == 2) {
      com_id = req.user.data.com_id;
      nhom_id_ng_xoa = req.user.data.idQLC;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
    if (!id_nhom.every(num => !isNaN(parseInt(num)))) {
      return functions.setError(res, 'id_nhom không hợp lệ', 400);
    }
    if (type == 1) {
      //Xóa vĩnh viễn
      let idArraya = id_nhom.map(idItem => parseInt(idItem));
      
      let result = await NhomTaiSan.deleteMany({ id_nhom: { $in: idArraya }, id_cty: com_id });
      if (result.deletedCount === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để xóa', 400);
      }
      return functions.success(res, 'xóa thành công!');
    }
    if (type == 2) {
      // thay đổi trang thái thành 1
      let idArray = id_nhom.map(idItem => parseInt(idItem));
      let result = await NhomTaiSan.updateMany(
        { id_nhom: { $in: idArray },nhom_da_xoa: 0 ,id_cty : com_id},
        { nhom_da_xoa: 1,
          nhom_id_ng_xoa : nhom_id_ng_xoa,
          nhom_date_delete : deleteDate,

        }
      );
      if (result.nModified === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'Bạn đã xóa thành công , thêm vào danh sách dã xóa !');
    }
    if (type == 3) {
      //khôi phục
      let idArray = id_nhom.map(idItem => parseInt(idItem));
      let result = await NhomTaiSan.updateMany(
        { id_nhom: { $in: idArray }, 
        nhom_da_xoa: 1,id_cty : com_id },
        { nhom_id_ng_xoa: 0 ,
          nhom_id_ng_xoa: 0 ,
          nhom_date_delete : 0,}
      );
      if (result.nModified === 0) {
        return functions.setError(res, 'Không tìm thấy bản ghi phù hợp để thay đổi', 400);
      }
      return functions.success(res, 'Bạn đã khôi phục nhóm tài sản thành công!');
    } else {
      return functions.setError(res, 'không có quyền xóa', 400)
    }

  } catch(e){
    console.log(e);
    return functions.setError(res , e.message)
}
}
