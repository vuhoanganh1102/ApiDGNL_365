const functions = require('../../services/functions')
const fnc = require('../../services/QLTS/qltsService')
const phanQuyen = require('../../models/QuanLyTaiSan/PhanQuyen')

exports.create = async (req, res) =>{
try{
    const id_user = req.body.id_user
    const id_cty = req.user.data.com_id
    let {
        ds_ts,
        capphat_thuhoi,
        dieuchuyen_bangiao,
        suachua_baoduong,
        mat_huy_tl,
        ql_nhanvien,
        phan_quyen} = req.body;

        let data = await phanQuyen.findOne({id_cty: id_cty, id_user:id_user}).lean()
        if(!data) {
            let max = await phanQuyen.findOne({},{},{sort : {id_phanquyen : -1}}).lean() || 0;
            const phanQuyenTao = new phanQuyen({
                id_phanquyen : Number(max.id_phanquyen) +1 || 1,
                id_user : id_user,
                id_cty : id_cty,
                ds_ts : ds_ts,
                capphat_thuhoi : capphat_thuhoi,
                dieuchuyen_bangiao : dieuchuyen_bangiao,
                suachua_baoduong : suachua_baoduong,
                mat_huy_tl : mat_huy_tl,
                ql_nhanvien : ql_nhanvien,
                phan_quyen : phan_quyen,
            })
            await phanQuyenTao.save()
            return functions.success(res,"Tạo thành công")
        }else{
            await phanQuyen.updateOne({id_cty: id_cty, id_user:id_user},{
                id_user : id_user,
                id_cty : id_cty,
                ds_ts : ds_ts,
                capphat_thuhoi : capphat_thuhoi,
                dieuchuyen_bangiao : dieuchuyen_bangiao,
                suachua_baoduong : suachua_baoduong,
                mat_huy_tl : mat_huy_tl,
                ql_nhanvien : ql_nhanvien,
                phan_quyen : phan_quyen,
            })
            return functions.success(res,"Cập nhật thành công")

        }
}catch(e){
     return functions.setError(res, e.message)
}
}

exports.list = async (req,res) =>{
try{
    const id_user = req.body.id_user
    const id_cty = req.user.data.com_id
        let data = await phanQuyen.findOne({id_cty: id_cty, id_user:id_user}).lean()
        if(data){
            return functions.success(res,"lấy thành công",{data})
        }
        return functions.setError(res, "không tìm thấy nhân viên được phân quyền")
}catch(e){
    return functions.setError(res, e.message)
}
}