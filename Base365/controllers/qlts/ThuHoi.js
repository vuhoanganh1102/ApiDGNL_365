const fnc = require('../../services/functions')
const ThuHoi = require('../../models/QuanLyTaiSan/ThuHoi')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const thongBao = require('../../models/QuanLyTaiSan/ThongBao')
const dep = require('../../models/qlc/Deparment')
const user = require('../../models/Users')


exports.create = async (req , res) =>{
    try{
    const id_cty = req.user.data.idQLC
    const thuhoi_ng_tao = req.user.data.idQLC
    const type_quyen = req.body.type_quyen
    const id_ng_thuhoi = req.body.id_ng_thuhoi
    const id_ng_dc_thuhoi = req.body.id_ng_dc_thuhoi
    const id_pb_thuhoi = req.body.id_pb_thuhoi
    const th_dai_dien_pb = req.body.th_dai_dien_pb
    const thuhoi__lydo = req.body.thuhoi__lydo
    const thuhoi_taisan = req.body.thuhoi_taisan
    const thuhoi_ngay = req.body.thuhoi_ngay
    const thuhoi_soluong = req.body.thuhoi_soluong
    const id_ng_nhan = req.body.id_ng_nhan
    const thuhoi_trangthai = 0
    let data = []
    let max =  await capPhat.findOne({},{},{sort: {_id : -1}}).lean() || 0;
    let maxThongBao = await thongBao.findOne({},{},{sort: {_id : -1}}).lean() || 0 ;

    let now = new Date()

    let loai_thuhoi = ""
    if(id_pb_thuhoi != 0){
        loai_thuhoi = 0
    }
    if(id_ng_dc_thuhoi != 0){
        loai_thuhoi = 1
    }

    if((thuhoi__lydo&&id_ng_thuhoi&&thuhoi_taisan&&thuhoi_ngay)){
        let listItems = await TaiSan.find({id_cty : idQLC}).select('ts_ten soluong_cp_bb').lean()

        
        let listDepartment = await dep.find({id_cty: idQLC}).select('deparmentName').lean()
        let listEmp = await user.find({"inForPerson.employee.com_id" : idQLC , type : 2}).select('userName').lean()

        
        
        if(listItems) data.listItems = listItems
        if(listDepartment) data.listDepartment = listDepartment
        if(listEmp)  data.listEmp = listEmp 
        //thu hoi nv
        if(loai_thuhoi = 0){
            let thuHoiNhanVien = new ThuHoi({
                _id : Number(max._id) + 1 ,
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
                thuhoi_taisan:thuhoi_taisan,
                thuhoi__lydo : thuhoi__lydo,
                thuhoi_soluong:thuhoi_soluong,
                thuhoi_date_create: Date.parse(now),
            })
             await thuHoiNhanVien.save()
        }
        //thu hoi phong ban
        if(loai_thuhoi = 1){
            let thuHoiPhongBan = new ThuHoi({
                _id : Number(max._id) + 1 ,
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
                thuhoi_taisan:thuhoi_taisan,
                thuhoi__lydo : thuhoi__lydo,
                thuhoi_soluong:thuhoi_soluong,
                thuhoi_date_create: Date.parse(now),
            })
             await thuHoiPhongBan.save()
        }
        //cap nhat thong bao
        let updateThongBao = new thongBao({
            _id : Number(maxThongBao._id) +1,
            id_ts : thuhoi_taisan,
            id_cty : idQLC,
            id_ng_tao : idQLC,
            id_ng_nhan : id_ng_nhan,
            type_quyen :2,
            type_quyen_tao: type_quyen,
            loai_tb: 11,
            add_or_duyet: 1,
            da_xem: 0,
            date_create :  Date.parse(now),
         })
         await updateThongBao.save()

         return fnc.success(res, " tạo thành công ",{data, updateThongBao})


    }else{
        return fnc.setError(res, " cần nhập đủ thông tin ")
    }

    
}catch(e){
    return fnc.setError(res , e.message)
}
}


//dong y thu hoi 
    exports.updateStatus = async (req , res) =>{
        try{
            const id_cty = req.user.data.idQLC
            const id_ng_dc_thuhoi = req.body.id_ng_dc_thuhoi
    
            const cap1 = await ThuHoi.findOne({ id_ng_dc_thuhoi: id_ng_dc_thuhoi , id_cty : id_cty});
                if (!cap1) {
                    return functions.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
                } else {
                    await ThuHoi.findOneAndUpdate({ id_ng_dc_thuhoi: id_ng_dc_thuhoi, id_cty: id_cty }, {
                        thuhoi_trangthai:1,
    
                        })
                        .then((cap1) => functions.success(res, "cập nhật thành công", {cap1}))
                        .catch((err) => functions.setError(res, err.message, 511));
                }
    
    
    
        }catch(e){
            return fnc.setError(res , e.message)
        }
        }

exports.getList = async (req , res) =>{
    try{
        // const id_cty = req.user.data.idQLC
        const id_cty = req.body.id_cty
        let option = req.body.option
        const id_nhanvien = req.body.id_nhanvien
        const id_phongban = req.body.id_phongban
        let data = {}
        let nameCapital = {}
        let listConditions = {};
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

    }catch(e){
        return fnc.setError(res , e.message)
    }
    }
    // if(option == 3) listConditions.thuhoi_trangthai = 0 //thu hôi chờ nhận
    // if(option == 4) listConditions.thuhoi_trangthai = 1 // đồng ý thu hồi 