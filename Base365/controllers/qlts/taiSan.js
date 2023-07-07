const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ViTri_ts = require('../../models/QuanLyTaiSan/ViTri_ts');
const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');
const quanlytaisanService = require('../../services/QLTS/qltsService')
const NhomTs = require('../../models/QuanLyTaiSan/NhomTaiSan')


const  User = require('../../models/Users')



exports.showadd = async (req,res) => {
 try{
    if(req.user.data.type = 1) {
        let com_id = req.user.data.idQLC
        let checktUser = await User.find({'inForPerson.employee.com_id' : com_id}).select('idQLC userName');
        let checkVitri = await ViTri_ts.find({id_cty : com_id}).select('id_vitri vi_tri');
        let checkloaiTaiSan = await LoaiTaiSan.find({id_cty : com_id}).select('id_loai ten_loai')
        let item = {
            checktUser,
            checkVitri,
            checkloaiTaiSan
        }
        return functions.success(res, 'get data success', { item })
    }else{
        return functions.setError(res, 'không có quyền truy cập', 400) 
    }
 }catch (error) {
        return functions.setError(res, error)
    }
}


exports.addTaiSan = async (req,res) => {
    try{
       let {
        id_loai_ts, id_nhom_ts, id_dv_quanly, 
        id_ten_quanly, ts_ten, sl_bandau, ts_so_luong, 
        soluong_cp_bb, ts_gia_tri, ts_don_vi, ts_vi_tri, 
        ts_trangthai, ts_da_xoa, ts_date_delete, 
        don_vi_tinh,ghi_chu
       } = req.body
       let createDate = Math.floor(Date.now() / 1000);
       if(req.user.data.type == 1){
        let com_id = req.user.data.idQLC;
        const validationResult = quanlytaisanService.validateCustomerInput(ts_ten,ts_don_vi,id_dv_quanly,id_ten_quanly);
        if(validationResult === true){
            let maxID = await quanlytaisanService.getMaxID(TaiSan);
            let ts_id = 0;
            if (maxID) {
              ts_id = Number(maxID) + 1;
            }
            let createNew = new TaiSan({
                ts_id: ts_id,
                id_cty: com_id,
                id_loai_ts: id_loai_ts,
                id_nhom_ts: id_nhom_ts,
                id_dv_quanly: id_dv_quanly,
                id_ten_quanly: id_ten_quanly,
                ts_ten: ts_ten,
                sl_bandau: sl_bandau,
                ts_so_luong: ts_so_luong,
                soluong_cp_bb: soluong_cp_bb,
                ts_gia_tri: ts_gia_tri,
                ts_don_vi: ts_don_vi,
                ts_vi_tri: ts_vi_tri,
                ts_trangthai: ts_trangthai,
                ts_date_sd: ts_date_sd,
                ts_type_quyen: ts_type_quyen,
                ts_da_xoa: ts_da_xoa,
                ts_date_create: createDate,
                ts_date_delete: ts_date_delete,
                don_vi_tinh: don_vi_tinh,
                ghi_chu: ghi_chu,
            })
            let save = await createNew.save()
            return functions.success(res,'save data success',{save})
        }
       }
       else{
        return functions.setError(res, 'không có quyền truy cập', 400) 
    }
    }catch (error) {
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
      return functions.setError(res, error);
    }
  };
  
