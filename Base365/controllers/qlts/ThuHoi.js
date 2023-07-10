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

        
        let listDepartment = await dep.find({com_id: idQLC}).select('deparmentName').lean()
        let listEmp = await user.find({"inForPerson.employee.com_id" : idQLC , type : 2}).select('userName').lean()

        
        
        if(listItems) data.listItemsType = listItemsType
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

