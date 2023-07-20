const fnc = require('../../services/functions')
const ThuHoi = require('../../models/QuanLyTaiSan/ThuHoi')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const thongBao = require('../../models/QuanLyTaiSan/ThongBao')
const dep = require('../../models/qlc/Deparment')
const user = require('../../models/Users')


exports.create = async (req , res) =>{
    try{
    const id_cty = req.user.data.com_id
    const thuhoi_ng_tao = req.user.data.idQLC
    const type_quyen = req.body.type_quyen
    const id_ng_thuhoi = req.body.id_ng_thuhoi
    const id_pb_thuhoi = req.body.id_pb_thuhoi
    const id_ng_dc_thuhoi = req.body.id_ng_dc_thuhoi
    const th_dai_dien_pb = req.body.th_dai_dien_pb
    const thuhoi__lydo = req.body.thuhoi__lydo
    const thuhoi_taisan = req.body.thuhoi_taisan
    const thuhoi_ngay = req.body.thuhoi_ngay
    const thuhoi_soluong = req.body.thuhoi_soluong
    const id_ng_nhan = req.body.id_ng_nhan
    let data = []
    let max =  await ThuHoi.findOne({},{},{sort: {thuhoi_id : -1}}).lean() || 0;
    let maxThongBao = await thongBao.findOne({},{},{sort: {id_tb : -1}}).lean() || 0 ;
    let now = new Date()
    let loai_thuhoi = ""
    if(!id_pb_thuhoi){
        loai_thuhoi = 0
    }
    else if(!id_ng_dc_thuhoi){
        loai_thuhoi = 1
    }
    if(type_quyen != 0){
        if((thuhoi__lydo&&id_ng_thuhoi&&thuhoi_taisan&&thuhoi_ngay)){
            let listItems = await TaiSan.find({id_cty : id_cty}).select('ts_ten soluong_cp_bb').lean()
            let listDepartment = await dep.find({id_cty: id_cty}).select('deparmentName').lean()
            let listEmp = await user.find({"inForPerson.employee.com_id" : id_cty , type : 2}).select('userName').lean()
            if(listItems) data.listItems = listItems
            if(listDepartment) data.listDepartment = listDepartment
            if(listEmp)  data.listEmp = listEmp 
            const ds_thuhoi = JSON.parse(thuhoi_taisan).ds_thuhoi;
            const updated_ds_thuhoi = ds_thuhoi.map((item) => ({
                ts_id: item[0],
                sl_th: item[1]
            }));
            //thu hoi nv
            if(loai_thuhoi === 0){
                let thuHoiNhanVien = new ThuHoi({
                    thuhoi_id : Number(max.thuhoi_id) + 1 || 1,
                    id_cty: id_cty,
                    id_ng_thuhoi : id_ng_thuhoi,
                    id_ng_dc_thuhoi:id_ng_dc_thuhoi,
                    type_quyen :2,
                    type_quyen_tao : type_quyen,
                    thuhoi_ng_tao: thuhoi_ng_tao,
                    loai_tb: 1,
                    thuhoi_ngay:thuhoi_ngay,
                    thuhoi_trangthai: 0,
                    add_or_duyet :0,
                    thuhoi_taisan:{ds_thuhoi: updated_ds_thuhoi},
                    thuhoi__lydo : thuhoi__lydo,
                    thuhoi_soluong:thuhoi_soluong,
                    thuhoi_date_create: Date.parse(now)/1000,
                })
                 await thuHoiNhanVien.save()
                 data.thuHoiNhanVien = thuHoiNhanVien
                 let updateThongBao = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
                    id_ts : updated_ds_thuhoi[0].ts_id,
                    id_cty : id_cty,
                    id_ng_tao : thuhoi_ng_tao,
                    id_ng_nhan : id_ng_nhan,
                    type_quyen :2,
                    type_quyen_tao: type_quyen,
                    loai_tb: 11,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                 })
                 await updateThongBao.save()
             return fnc.success(res, " tạo thành công ",{data,thuHoiNhanVien,updateThongBao})

            }else if(loai_thuhoi === 1){
            //thu hoi phong ban
                let thuHoiPhongBan = new ThuHoi({
                    thuhoi_id : Number(max.thuhoi_id) + 1 || 1,
                    id_cty: id_cty,
                    id_ng_thuhoi : id_ng_thuhoi,
                    id_pb_thuhoi:id_pb_thuhoi,
                    th_dai_dien_pb :th_dai_dien_pb,
                    type_quyen :2,
                    type_quyen_tao : type_quyen,
                    thuhoi_ng_tao: thuhoi_ng_tao,
                    thuhoi_trangthai: 0,
                    loai_tb: 1,
                    thuhoi_ngay:thuhoi_ngay,
                    add_or_duyet :0,
                    thuhoi_taisan:{ds_thuhoi: updated_ds_thuhoi},
                    thuhoi__lydo : thuhoi__lydo,
                    thuhoi_soluong:thuhoi_soluong,
                    thuhoi_date_create: Date.parse(now)/1000,
                })
                 await thuHoiPhongBan.save()
                 let updateThongBao = new thongBao({
                    id_tb : Number(maxThongBao.id_tb) +1 || 1,
                    id_ts : updated_ds_thuhoi[0].ts_id,
                    id_cty : id_cty,
                    id_ng_tao : thuhoi_ng_tao,
                    id_ng_nhan : id_ng_nhan,
                    type_quyen :2,
                    type_quyen_tao: type_quyen,
                    loai_tb: 11,
                    add_or_duyet: 1,
                    da_xem: 0,
                    date_create :  Date.parse(now)/1000,
                 })
                 await updateThongBao.save()
             return fnc.success(res, " tạo thành công ",{data,thuHoiPhongBan,updateThongBao})

            }else{
            return fnc.setError(res, " cần nhập đủ thông tin ")
            }
        }else{
            return fnc.setError(res, " cần nhập đủ thông tin ")
        }
    }else{
        return fnc.setError(res, "bạn chưa có quyền", 510);
    }
}catch(e){
    return fnc.setError(res , e.message)
}
}


//dong y thu hoi 
exports.updateStatus = async (req , res) =>{
    try{
        const type = req.user.data.type
        const id_cty = req.user.data.com_id
        const id_nhanvien = req.body.id_nhanvien
        const id_phongban = req.body.id_phongban
        let listConditions = {};
        if(id_cty) listConditions.id_cty = id_cty
        if(id_nhanvien) listConditions.id_nhanvien = id_nhanvien
        if(id_phongban) listConditions.id_phongban = id_phongban

        const data = await ThuHoi.findOne(listConditions);
            if (!data) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await ThuHoi.findOneAndUpdate(listConditions , {
                    thuhoi_trangthai:1,
                    })
                    .then((data) => fnc.success(res, "cập nhật thành công", {data}))
                    .catch((err) => fnc.setError(res, err.message, 511));
            }
    }catch(e){
        return fnc.setError(res , e.message)
    }
    }


exports.getListDetail = async (req , res) =>{
    try{
        const id_cty = req.user.data.com_id
        const type_quyen = req.body.type_quyen
        let option = req.body.option
        const id_nhanvien = req.body.id_nhanvien
        const id_phongban = req.body.id_phongban
        let data = {}
        let nameCapital = {}
        let listConditions = {};
       if(type_quyen != 0){
        if(id_cty) listConditions.id_cty = id_cty 
        if(option == 1) listConditions.thuhoi_trangthai = 0, listConditions.id_nhanvien =  id_nhanvien  ////thu hôi chờ nhận NV
        if(option == 2) listConditions.thuhoi_trangthai = 1, listConditions.id_nhanvien =  id_nhanvien // đồng ý thu hồi  NV
        if(option == 3) listConditions.thuhoi_trangthai = 0 , listConditions.id_phongban =  id_phongban  // //thu hôi chờ nhận PB
        if(option == 4) listConditions.thuhoi_trangthai = 1 , listConditions.id_phongban = id_phongban  // đồng ý thu hồi  PB
        
        data = await ThuHoi.find(listConditions).select('thuhoi_taisan thuhoi_ngay thuhoi_hoanthanh thuhoi__lydo thuhoi_soluong thuhoi_trangthai').lean()
        if(data){
            if(data.thuhoi_taisan) nameCapital = await TaiSan.find({_id : data.thuhoi_taisan}).select("ts_ten").lean()
            if(nameCapital!=0) data.nameCapital = nameCapital
            return fnc.success(res, " lấy thành công ",{data})

        }else{
            return fnc.setError(res, "không tìm thấy đối tượng", 510);
        }
       }else{
             return fnc.setError(res, "bạn chưa có quyền", 510);
       }
    }catch(e){
        console.log(e);
        return fnc.setError(res , e.message)
    }
    }


    exports.edit = async(req,res)=>{
        try{
            const id_cty = req.user.data.com_id
            const id_ng_thuhoi = req.user.data.idQLC//id nguoi tao
            // const type_quyen = req.body.type_quyen
            const thuhoi_id = req.body.thuhoi_id;
            const thuhoi_ngay = req.body.thuhoi_ngay;
            const thuhoi_soluong = req.body.thuhoi_soluong;
            const id_ng_dc_thuhoi = req.body.id_ng_dc_thuhoi;
            const thuhoi__lydo = req.body.thuhoi__lydo;
            const loai_edit =req.body.loai_edit
            const data = await ThuHoi.findOne({ thuhoi_id: thuhoi_id,id_cty: id_cty });
                if (!data) {
                    fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                } else {
                    if(loai_edit == 2){
                        await ThuHoi.updateOne({ thuhoi_id: thuhoi_id,id_cty:id_cty }, {
                            thuhoi_ngay : thuhoi_ngay,
                            thuhoi_soluong:thuhoi_soluong,
                            thuhoi__lydo : thuhoi__lydo,
                            id_ng_thuhoi :id_ng_thuhoi,
                            id_pb_thuhoi: id_ng_dc_thuhoi,
                            id_ng_dc_thuhoi:id_ng_dc_thuhoi,
                            })
                        return fnc.success(res, "cập nhật thành công")
                    }else{
                        await ThuHoi.updateOne({ thuhoi_id: thuhoi_id,id_cty:id_cty }, {
                            thuhoi_ngay : thuhoi_ngay,
                            thuhoi_soluong:thuhoi_soluong,
                            thuhoi__lydo : thuhoi__lydo,
                            })
                        return fnc.success(res, "cập nhật thành công", {data})
                    }
                  
                }
            // }else{
                // return fnc.setError(res, "bạn chưa có quyền", 510);
            //   }
        }catch(e){
            return fnc.setError(res , e.message)
        }
    }

exports.delete = async (req , res) =>{
    try{
            const type = req.user.data.type
            const id_cty = ""
            if(type == 1){
                 id_cty = req.user.data.idQLC
            }else{
                id_cty = req.user.data.inForPerson.employee.com_id
            }
            const datatype = req.body.datatype
            const _id = req.body.id
            const type_quyen = req.body.type_quyen
            const id_ng_xoa = req.user.data.idQLC 
            const date_delete = new Date()
        if(type_quyen != 0){
            if(datatype == 1){
                const data = await ThuHoi.findOne({ _id: _id, id_cty : id_cty });
                if (!data) {
                    return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                } else {
                    await ThuHoi.findOneAndUpdate({ _id: _id }, {
                        id_cty: id_cty,
                        cp_da_xoa : 1,
                        cp_type_quyen_xoa : type_quyen,
                        cp_id_ng_xoa :id_ng_xoa,
                        cp_date_delete : Date.parse(date_delete),
    
                        })
                        .then((data) => fnc.success(res, "cập nhật thành công", {data}))
                        .catch((err) => fnc.setError(res, err.message, 511));
                }
            }
            if(datatype == 2){
                const data = await ThuHoi.findOne({ _id: _id , id_cty : id_cty});
                if (!data) {
                    return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                } else {
                    await ThuHoi.findOneAndUpdate({ _id: _id, id_cty: id_cty }, {
                        id_cty: id_cty,
                        cp_da_xoa : 0,
                        cp_type_quyen_xoa : 0,
                        cp_id_ng_xoa :0,
                        cp_date_delete : 0,
    
                        })
                        .then((data) => fnc.success(res, "cập nhật thành công", {data}))
                        .catch((err) => fnc.setError(res, err.message, 511));
                }
            }
            if(datatype == 3){
                const deleteonce = await fnc.getDatafindOne(ThuHoi, { _id: _id , id_cty : id_cty});
            if (!deleteonce) { 
                return fnc.setError(res, "không tìm thấy bản ghi", 510);
            } else { //tồn tại thì xóa 
                fnc.getDataDeleteOne(ThuHoi, { _id: _id })
                    .then(() => fnc.success(res, "xóa thành công!", {deleteonce}))
                    .catch(err => fnc.setError(res, err.message, 512));
            }
            }
        }else{
            return fnc.setError(res, "bạn chưa có quyền", 510);
      }
    }catch(e){
        return fnc.setError(res , e.message)
    }
    }