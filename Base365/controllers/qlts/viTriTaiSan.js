const ViTriTs = require('../../models/QuanLyTaiSan/ViTri_ts');
const quanlytaisanService = require('../../services/QLTS/qltsService')

exports.addViTriTaiSan = async (req, res) => {
    try{
        let { ten_vitri } = req.body;
        let com_id = '';
        let dv_quan_ly = '';
        let quyen_dv_qly = '';
        let createDate = Math.floor(Date.now() / 1000);
        if (req.user.data.type == 1) {
          com_id = req.user.data.idQLC;
          dv_quan_ly = req.user.data.idQLC;
          quyen_dv_qly = 1
        }
        if (req.user.data.type == 2) {
            com_id = req.user.data.inForPerson.employee.com_id;
            dv_quan_ly = req.user.data.idQLC;
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
                id_vitri: id_nhom,
              ten_nhom: ten_nhom,
              id_cty: com_id,
              nhom_date_create: createDate
            })
            let save = await createNew.save()
            return functions.success(res, 'save data success', { save })
          }
    }catch (error) {
      console.log(error);
      return functions.setError(res, error)
    }

}

exports.showViTriTs = async (req, res) =>  {
    try {
      let { id_vitri, page, perPage } = req.body
      let com_id = '';
      page = page || 1;
      perPage = perPage || 10;
      let query = {};
      const startIndex = (page - 1) * perPage;
      const endIndex = page * perPage;
      if (id_vitri) {
        query.id_vitri = id_vitri;
      }
      if (req.user.data.type == 1) {
        com_id = req.user.data.idQLC;
      } else if (req.user.data.type == 2) {
        com_id = req.user.data.inForPerson.employee.com_id;
      } else {
        return functions.setError(res, 'không có quyền truy cập', 400);
      }
      const showVitri = await ViTriTs.find({ id_cty: com_id, ...query })
        .sort({ id_vitri: -1 })
        .skip(startIndex)
        .limit(perPage);
      const totalTsCount = await ViTriTs.countDocuments({ id_cty: com_id, ...query });
  
      // Tính toán số trang và kiểm tra xem còn trang kế tiếp hay không
      const totalPages = Math.ceil(totalTsCount / perPage);
      const hasNextPage = endIndex < totalTsCount;
  
      return functions.success(res, 'get data success', { showVitri, totalPages, hasNextPage });
    } catch (error) {
      console.log(error);
      return functions.setError(res, error)
    }
  }