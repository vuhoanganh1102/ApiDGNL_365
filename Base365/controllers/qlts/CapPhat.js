const fnc = require('../../services/functions')
const capPhat = require('../../models/QuanLyTaiSan/CapPhat')
const TaiSan = require('../../models/QuanLyTaiSan/TaiSan')
const thongBao = require('../../models/QuanLyTaiSan/ThongBao')
const dep = require('../../models/qlc/Deparment')
const user = require('../../models/Users')

exports.createAllocationDep = async(req,res)=>{
    try{
        const role = req.user.data.role
        const idQLC = req.user.data.idQLC
        const pageNumber = req.body.pageNumber || 1;
        const id_pb = req.body.id_pb;
        const cp_lydo = req.body.cp_lydo;
        const cp_trangthai = req.body.cp_trangthai;
        const ts_daidien_nhan = req.body.ts_id;
        const id_ng_daidien = req.body.id_ng_daidien;
        let data = []
        let listItemsType1 = []
        let listItemsType2 = []

        let max = capPhat.findOne({},{_id : 1}).sort({_id : -1}).limit(1).lean() || 0;
        let maxThongBao = thongBao.findOne({},{_id : 1}).sort({_id : -1}).limit(1).lean() || 0;
        let now = new Date()
        
        if((id_pb&&cp_lydo&&ts_daidien_nhan&&id_ng_daidien)){
            if(role == 1){
                 listItemsType1 = await TaiSan.find({ts_type_quyen : 1}).select('ts_ten soluong_cp_bb').lean()
            }else{
                 listItemsType2 = await TaiSan.find({ts_type_quyen : 2}).select('ts_ten soluong_cp_bb').lean()
    
            }
            if(listItemsType1) data.listItemsType1 = listItemsType1
            if(listItemsType2) data.listItemsType2 = listItemsType2
    
            let listDepartment = await dep.find({com_id: idQLC}).select('deparmentName').lean()
            let listEmp = await user.find({"inForPerson.employee.com_id" : idQLC , type : 2}).select('userName').lean()
    
            
            
            if(listDepartment) data.listDepartment = listDepartment
            if(listEmp)  data.listEmp = listEmp 
    
            let capPhat_choNhan = await capPhat.find({cp_trangthai : 5 ,cp_da_xoa : 0 ,id_pb : id_pb ,com_id: idQLC }).skip((pageNumber - 1)*10).limit(10).sort({_id : -1}).lean()
            let count = await capPhat.countDocuments({cp_trangthai : 5 ,cp_da_xoa : 0 ,id_pb : id_pb ,com_id: idQLC })
    
            if(capPhat_choNhan) data.capPhat_choNhan = capPhat_choNhan
            if(count) data.count = count
            let CapPhatPB = new capPhat({
                _id : Number(max) + 1 ,
                id_pb: id_pb,
                cp_id_ng_tao : idQLC,
                cp_trangthai : cp_trangthai,
                ts_daidien_nhan :ts_daidien_nhan,
                cp_date_create :  Date.parse(now),
                id_ng_daidien: id_ng_daidien,
                cp_lydo : cp_lydo,
            })
             await CapPhatPB.save()
            
             if(CapPhatPB) data.CapPhatPB = CapPhatPB
             
             let updateQuantity = await TaiSan.findOne({ts_id :ts_daidien_nhan}).lean()
             if(!updateQuantity) {
                return fnc.setError(res, " khong tim thay tai san ")
             }else{
                await TaiSan.updateOne({ts_id :ts_daidien_nhan}, {
                    $set : {
                        soluong_cp_bb : Number(soluong_cp_bb) - 1
                    }
                })
             }
             let updateThongBao = new thongBao({
                _id : Number(maxThongBao) +1,
                id_ts : ts_daidien_nhan,
                id_cty : idQLC,
                id_ng_tao : idQLC,
                type_quyen :1,
                type_quyen_tao:1,
                loai_tb: 1,
                da_xem: 0,
                date_create :  Date.parse(now),
             })
             await updateThongBao.save()

            return fnc.success(res, " tạo thành công ",{data})

        }else{
            return fnc.setError(res, " cần nhập đủ thông tin ")
        }

        



    }catch(e){
        return fnc.setError(res , e.message)
    }
}

