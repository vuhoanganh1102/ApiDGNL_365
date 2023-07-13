const ViTriTs = require('../../models/QuanLyTaiSan/ViTri_ts');
const quanlytaisanService = require('../../services/QLTS/qltsService')
const Depament = require('../../models/qlc/Deparment')
const functions = require('../../services/functions')

exports.addViTriTaiSan = async (req, res) => {
    try{
        let { ten_vitri,dv_quan_ly,ghi_chu_vitri,quyen_dv_qly } = req.body;
        let com_id = '';
        if (req.user.data.type == 1) {
          com_id = req.user.data.idQLC;
        }
        else if (req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id;
          } else {
          return functions.setError(res, 'không có quyền truy cập', 400);
        }
        if (typeof ten_vitri === 'undefined') {
          return functions.setError(res, 'tên vị trí  không được bỏ trống', 400);
        } else {
            let maxID = await quanlytaisanService.getMaxIDVT(ViTriTs)
            let id_vitri = 0;
            if (maxID) {
                id_vitri = Number(maxID) + 1;
            }
            let createNew = new ViTriTs({
                id_vitri: id_vitri,
              vi_tri: ten_vitri,
              id_cty: com_id,
              dv_quan_ly : dv_quan_ly,
              quyen_dv_qly : quyen_dv_qly,
              ghi_chu_vitri : ghi_chu_vitri
            })
            let save = await createNew.save()
            return functions.success(res, 'save data success', { save })
          }
    }catch (error) {
      console.log(error);
      return functions.setError(res, error)
    }

}

exports.showaddViTri = async (req,res) => {
  try{
    let com_id = '';
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
      let showdpcom = await Depament.find({com_id : com_id }).select('_id deparmentName')
      return  functions.success(res, 'get data success', { showdpcom })
    } 
    else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
      let showdpnv = await Depament.find({com_id : com_id}).select('_id deparmentName')
      return  functions.success(res, 'get data success', { showdpnv })
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }
  }catch (error) {
      console.log(error);
      return functions.setError(res, error)
    }
}

exports.show = async (req, res) => {
  try {
    let com_id = '';
    let { id_vitri, page, perPage } = req.body;
    if (req.user.data.type == 1) {
      com_id = req.user.data.idQLC;
    } else if (req.user.data.type == 2) {
      com_id = req.user.data.inForPerson.employee.com_id;
    } else {
      return functions.setError(res, 'không có quyền truy cập', 400);
    }

    page = parseInt(page) || 1; // Trang hiện tại (mặc định là trang 1)
    perPage = parseInt(perPage) || 10; // Số lượng bản ghi trên mỗi trang (mặc định là 10)

    let matchQuery = {
      id_cty: com_id, // Lọc theo com_id
    };

    if (id_vitri) {
      matchQuery.id_vitri = parseInt(id_vitri); // Lọc theo id_vitri nếu có
    }

    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    let data = await ViTriTs.aggregate([
      {
        $match: matchQuery, // Áp dụng các điều kiện lọc
      },
      {
        $lookup: {
          from: 'qlc_deparments', // Tên bảng khác bạn muốn tham gia
          localField: 'dv_quan_ly',
          foreignField: 'dep_id',
          as: 'name_dep',
        },
      },
      {
        $skip: startIndex, // Bỏ qua các bản ghi từ startIndex
      },
      {
        $limit: perPage, // Giới hạn số lượng bản ghi trả về là perPage
      },
    ]);

    const totalItems = await ViTriTs.countDocuments(matchQuery); // Tổng số bản ghi

    const totalPages = Math.ceil(totalItems / perPage); // Tổng số trang

    const hasNextPage = endIndex < totalItems; // Kiểm tra xem còn trang kế tiếp hay không

    return functions.success(res, 'get data success', { data, totalPages, hasNextPage });
  } catch (error) {
    console.log(error);
    return functions.setError(res, error);
  }
};

exports.deleteVT = async(req,res) => {
    try {
      let { datatype, id_vitri, type_quyen } = req.body;
      let com_id = '';
      console.log(req.user.data.type);
      if (typeof id_vitri === 'undefined') {
        return functions.setError(res, 'id_vitri không được bỏ trống', 400);
      }
      if (isNaN(Number(id_vitri))) {
        return functions.setError(res, 'id nhóm phải là một số', 400);
      }
      if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
      } 
      else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id;
      } else {
        return functions.setError(res, 'không có quyền truy cập');
      }     
      await ViTriTs.findOneAndDelete({ id_vitri: id_vitri, id_cty: com_id })
      return functions.success(res, 'thanh cong');
      
    } catch (error) {
      console.log(error);
      return functions.setError(res, error);
    }
}

