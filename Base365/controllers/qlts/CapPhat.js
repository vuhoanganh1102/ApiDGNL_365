const fnc = require('../../services/functions')
const capPhat = require('../../models/QuanLyTaiSan/CapPhat')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const thongBao = require('../../models/QuanLyTaiSan/ThongBao')
const dep = require('../../models/qlc/Deparment')
const user = require('../../models/Users')

exports.create = async(req,res)=>{
    try{
        const id_cty = req.user.data.idQLC
        const idQLC = req.user.data.idQLC
        const pageNumber = req.body.pageNumber || 1;
        const id_pb = req.body.id_pb;
        const cp_lydo = req.body.cp_lydo;
        const cp_trangthai = req.body.cp_trangthai;
        const ts_daidien_nhan = req.body.ts_id;
        const cap_phat_taisan = req.body.cap_phat_taisan;
        const id_ng_thuchien = req.body.id_ng_thuchien;
        const id_ng_daidien = req.body.id_ng_daidien;
        let data = []
        let listItemsType = []
        let soluong_cp_bb = {}
        let max =  await capPhat.findOne({},{},{sort: {cp_id : -1}}).lean() || 0;
        let maxThongBao = await thongBao.findOne({},{},{sort: {id_tb : -1}}).lean() || 0 ;
        let now = new Date()
        if((cp_lydo&&ts_daidien_nhan&&id_ng_daidien&&id_ng_thuchien)){
            listItemsType = await TaiSan.find({id_cty : idQLC}).select('ts_ten soluong_cp_bb').lean()
            console.log(listItemsType)
            if(listItemsType) data.listItemsType = listItemsType
            let listDepartment = await dep.find({com_id: id_cty}).select('deparmentName').lean()
            let listEmp = await user.find({"inForPerson.employee.com_id" : id_cty , type : 2}).select('userName').lean()
            if(listDepartment) data.listDepartment = listDepartment
            if(listEmp)  data.listEmp = listEmp 
            const ds_ts = JSON.parse(cap_phat_taisan).ds_ts;
                    const updated_ds_ts = ds_ts.map((item) => ({
                        ts_id: item[0],
                        sl_th: item[1]
                    }));
            let CapPhatPB = new capPhat({
                //tao cap phat neu la cap phat phong ban thi dien phong ban, neu la cap phat nhan vien thi khong dien id_pb
                cp_id : Number(max.cp_id) + 1 ,
                id_phongban: id_pb,
                cap_phat_taisan: {ds_ts: updated_ds_ts},
                cp_id_ng_tao : idQLC,
                id_cty : id_cty,
                cp_trangthai : cp_trangthai||0,
                ts_daidien_nhan :ts_daidien_nhan,
                cp_date_create :  Date.parse(now),
                id_ng_daidien: id_ng_daidien,
                id_ng_thuchien :id_ng_thuchien,
                cp_lydo : cp_lydo,
            })
             await CapPhatPB.save()
             data.CapPhatPB = CapPhatPB
             let updateQuantity = await TaiSan.findOne({ts_id :ts_daidien_nhan}).lean()
             if(!updateQuantity) {
                return fnc.setError(res, " khong tim thay tai san ")
             }else{//cap nhat so luong tai san 
                await TaiSan.findOneAndUpdate({ts_id :ts_daidien_nhan}, {soluong_cp_bb : Number(soluong_cp_bb) - 1 || 0})
             }//cap nhat thong bao
             let updateThongBao = new thongBao({
                id_tb : Number(maxThongBao.id_tb) +1 || 1,
                id_ts : updated_ds_ts[0].ts_id,
                id_cty : id_cty,
                id_ng_tao : idQLC,
                type_quyen :1,
                type_quyen_tao:1,
                loai_tb: 1,
                da_xem: 0,
                date_create :  Date.parse(now),
             })
             await updateThongBao.save()

            return fnc.success(res, " tạo thành công ",{data,CapPhatPB, updateThongBao})

        }else{
            return fnc.setError(res, " cần nhập đủ thông tin ")
        }
    }catch(e){
        return fnc.setError(res , e.message)
    }
}

exports.edit = async(req,res)=>{
    try{
        const type = req.user.data.type
        const id_cty = ""
        if(type == 1){
            id_cty = req.user.data.idQLC
        }else{
            id_cty = req.user.data.inForPerson.employee.com_id
        }
        const idQLC = req.user.data.idQLC
        const _id = req.body.id;
        const cp_ngay = req.body.cp_ngay;
        const cp_lydo = req.body.cp_lydo;
        const cap = await capPhat.findOne({ _id: _id });
            if (!cap) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await capPhat.findOneAndUpdate({ _id: _id }, {
                    id_cty: id_cty,
                    cp_ngay : cp_ngay,
                    cp_lydo : cp_lydo,
                    cp_id_ng_tao :idQLC,
                    })
                    return fnc.success(res, "cập nhật thành công", {cap})
            }


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

        if(datatype == 1){
            const data = await capPhat.findOne({ _id: _id, id_cty : id_cty });
            if (!data) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await capPhat.findOneAndUpdate({ _id: _id }, {
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
            const data = await capPhat.findOne({ _id: _id , id_cty : id_cty});
            if (!data) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await capPhat.findOneAndUpdate({ _id: _id, id_cty: id_cty }, {
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
            const deleteonce = await fnc.getDatafindOne(capPhat, { _id: _id , id_cty : id_cty});
        if (!deleteonce) { 
            return fnc.setError(res, "không tìm thấy bản ghi", 510);
        } else { //tồn tại thì xóa 
            fnc.getDataDeleteOne(capPhat, { _id: _id })
                .then(() => fnc.success(res, "xóa thành công!", {deleteonce}))
                .catch(err => fnc.setError(res, err.message, 512));
        }
        }


    
}catch(e){
    return fnc.setError(res , e.message)
}
}

// dong y tiep nhan cap phat
exports.updateStatus = async (req , res) =>{
    try{
        const type = req.user.data.type
        const id_cty = ""
        if(type == 1){
             id_cty = req.user.data.idQLC
        }else{
            id_cty = req.user.data.inForPerson.employee.com_id
        }
        const id_nhanvien = req.body.id_nhanvien
        const id_phongban = req.body.id_phongban
        let listConditions = {};
        if(id_cty) listConditions.id_cty = id_cty
        if(id_nhanvien) listConditions.id_nhanvien = id_nhanvien
        if(id_phongban) listConditions.id_phongban = id_phongban

        const data = await capPhat.findOne(listConditions);
            if (!data) {
                return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
            } else {
                await capPhat.findOneAndUpdate(listConditions , {
                    cp_trangthai: 6,

                    })
                    .then((data) => fnc.success(res, "cập nhật thành công", {data}))
                    .catch((err) => fnc.setError(res, err.message, 511));
            }



    }catch(e){
        return fnc.setError(res , e.message)
    }
    }

exports.getList = async (req , res) =>{
        try{
            const type = req.user.data.type
            // const id_cty = ""
            // if(type == 1){
            //      id_cty = req.user.data.idQLC
            // }else{
            //     id_cty = req.user.data.inForPerson.employee.com_id
            // }
            const id_cty = req.body.id_cty//test
            const id_nhanvien = req.body.id_nhanvien
            const id_phongban = req.body.id_phongban
            const cp_trangthai = 6
            let depName = {}
            let userName = {}
            let depNameofUser = {}
            let countCapital = {}
            let countUser = {}
    
            
            let data = {}
            let listConditions = {};
             // lay danh sach chi tiet phong ban - nhan vien
            let listDepartment = await dep.find({com_id: id_cty}).select('deparmentName').lean()
            let listEmp = await user.find({"inForPerson.employee.com_id" : id_cty , type : 2}).select('userName inForPerson.employee.position_id').lean()
    
            if(listDepartment) data.listDepartment = listDepartment
            if(listEmp)  data.listEmp = listEmp
            //-------------------------------------------------------------------------------------------
    
            //dieu kien tim kiem
            if(id_cty) listConditions.id_cty = id_cty
            if(id_nhanvien) listConditions.id_nhanvien = id_nhanvien
            if(id_phongban) listConditions.id_phongban = id_phongban
            if(cp_trangthai) listConditions.cp_trangthai = cp_trangthai
            // tim kiem
            let danhSach = await capPhat.find(listConditions).select('id_nhanvien id_phongban cap_phat_taisan ts_daidien_nhan').lean()

            if(!danhSach){
                return fnc.setError(res, "không tìm thấy đối tượng", 510);

            }else{

                if(danhSach) data.danhSach =  danhSach
                // lay ten phong ban
                if((danhSach[0].id_phongban)!=0) depName = await dep.findOne({com_id: id_cty, _id: danhSach[0].id_phongban }).select('deparmentName').lean()
                console.log(danhSach[0].id_phongban)
                // lay ten nhan vien
                if((danhSach[0].id_nhanvien)!=0) userName = await user.findOne({"inForPerson.employee.com_id" : id_cty , type : 2}).select('userName inForPerson.employee.dep_id inForPerson.employee.position_id ').lean()
                console.log(userName)

                // .then((depNameofUser) => {
                //     depNameofUser = dep.findOne({com_id: id_cty, _id : inForPerson.employee.dep_id}).select('deparmentName').lean()
                // })
                // lay so luong tai san cap phat
                if(danhSach.cap_phat_taisan) 
                   countCapital = danhSach.map(item => item.id_cty);
                   console.log(countCapital)
                  for (let i = 0; i < countCapital.length; i++) {
                      const depId = countCapital[i];
                      total_emp = await functions.findCount(TaiSan, { })
                  }
                // lay nguoi dai dien --- chua ro vi api trả ra bằng  "0"
                if(danhSach.ts_daidien_nhan) countUser = capPhat.countDocuments({})


                if(depName) data.depName = depName
                if(userName) data.userName = userName
                if(countCapital) data.countCapital = countCapital

                return fnc.success(res, " lấy thành công ",{data})


            }
    
    
        }catch(e){
            console.log(e)
            return fnc.setError(res , e.message)
        }
        }

exports.getListDetail = async (req , res) =>{
    try{
        const type = req.user.data.type
        // const id_cty = ""
        // if(type == 1){
        //      id_cty = req.user.data.idQLC
        // }else{
        //     id_cty = req.user.data.inForPerson.employee.com_id
        // }
        const id_cty = req.body.id_cty
        let option = req.body.option
        const id_nhanvien = req.body.id_nhanvien
        const id_phongban = req.body.id_phongban
        let data = {}
        let listConditions = {};
        if(id_cty) listConditions.id_cty = id_cty 
        if(option == 1) listConditions.cp_trangthai = 0, listConditions.id_nhanvien =  id_nhanvien  //cấp phát chờ nhận NV
        if(option == 2) listConditions.cp_trangthai = 6, listConditions.id_nhanvien =  id_nhanvien // tiếp nhận cấp phát NV
        if(option == 3) listConditions.cp_trangthai = 0 , listConditions.id_nhanvien =  id_phongban  // cấp phát chờ nhận PB
        if(option == 4) listConditions.cp_trangthai = 6 , listConditions.id_nhanvien =  id_phongban  // tiếp nhận cấp phát PB
        
        data = await capPhat.find(listConditions).select('cp_trangthai cp_id_ng_tao cp_date_create cp_lydo').lean()
        if(data){
            return fnc.success(res, " lấy thành công ",{data})

        }else{
            return fnc.setError(res, "không tìm thấy đối tượng", 510);

        }

    }catch(e){
        return fnc.setError(res , e.message)
    }
    }


