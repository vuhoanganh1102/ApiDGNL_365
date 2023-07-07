const TaiSan = require('../../models/QuanLyTaiSan/TaiSan');
const ViTri_ts = require('../../models/QuanLyTaiSan/ViTri_ts');
const LoaiTaiSan = require('../../models/QuanLyTaiSan/LoaiTaiSan');
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
        id_cty, id_loai_ts, id_nhom_ts, id_dv_quanly, 
        id_ten_quanly, ts_ten, sl_bandau, ts_so_luong, 
        soluong_cp_bb, ts_gia_tri, ts_don_vi, ts_vi_tri, 
        ts_trangthai, ts_da_xoa, ts_date_delete, 
        ts_date_create,don_vi_tinh,ghi_chu
       } = req.body
       
    }catch (error) {
        return functions.setError(res, error)
    }
}

