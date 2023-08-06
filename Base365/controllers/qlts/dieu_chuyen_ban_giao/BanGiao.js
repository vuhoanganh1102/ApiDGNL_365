const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen");
const fnc = require("../../../services/functions");
// const thongBao = require('../../../models/QuanLyTaiSan/ThongBao')
const capPhat = require('../../../models/QuanLyTaiSan/CapPhat')
const ThuHoi = require('../../../models/QuanLyTaiSan/ThuHoi')
const department = require('../../../models/qlc/Deparment');
 

exports.list = async (req, res) => {
    try{
        const id_cty = req.user.data.com_id
        const id_ng_thuchien = req.body.id_ng_thuchien
        const id_ng_thuhoi = req.body.id_ng_thuhoi
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize)/2;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        let data = []
        let listConditions = {};
        listConditions.id_cty = id_cty
        if(id_ng_thuchien) {listConditions.id_ng_thuchien = Number(id_ng_thuchien)
        }else{listConditions.id_ng_thuchien = {$ne : 0}}
        if(id_ng_thuhoi) {listConditions.id_ng_thuhoi = Number(id_ng_thuhoi)
        }else{listConditions.id_ng_thuhoi = {$ne : 0}}
        let numAllocaction = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 })
        let numRecall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 })
        let dem_bg = (numAllocaction.length + numRecall.length)
        let transferLocate = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0,dc_type :0}).count()
        let transferObject = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0,dc_type :1}).count()
        let transferManagerUnit = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0, dc_type :2}).count()
        if(dem_bg)  data.push({dem_bg: dem_bg})
        else  data.push({dem_bg: 0})
        if(transferLocate)  data.push({transferLocate: transferLocate})
        else  data.push({transferLocate: 0})

        if(transferObject) data.push({transferObject: transferObject})
        else  data.push({transferObject: 0})

        if(transferManagerUnit) data.push({transferManagerUnit: transferManagerUnit})
        else  data.push({transferManagerUnit: 0})

        console.log(listConditions)
        //query find user hand over 

        // let allocation = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 })
        // let recall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 })
        // if(allocation) data.push({queryAllocation: allocation}) 
        // if(recall) data.push({queryRecall: recall})

        // end Query
                let UserAllocation = await capPhat.aggregate([ 
                    {$match: listConditions},
                    {$skip : skip },
                    {$limit : limit },
                    {$sort: {cp_id:-1}},
                    {
                        $lookup: {
                            from: "Users",
                            localField: "id_ng_thuchien",
                            foreignField: "_id",
                            // pipeline: [
                            //     { $match: {$and : [
                            //     { "type" : {$ne : 1 }},
                            //     {"idQLC":{$ne : 0}},
                            //     {"idQLC":{$ne : 1}}] },
                            //     }
                            // ],
                             as : "info"
                        }
                    },
                { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },

                    {$project : {  
                        cp_id : 1,
                        cp_trangthai : 1,
                        id_ng_thuchien : 1,
                        ten_ng_thuchien : "$info.userName",
                        dep_id : "$info.inForPerson.employee.dep_id",
                    }}, 
                    
                ]) 
                for (let j = 0; j < UserAllocation.length; j++) {
                if(UserAllocation[j].dep_id != 0 ){
                    let depName_cua_nhan_vien = await department.findOne({ com_id: id_cty, dep_id: UserAllocation[j].dep_id })
                    if(depName_cua_nhan_vien) UserAllocation[j].depName_cua_nhan_vien = depName_cua_nhan_vien.dep_name 
                }

                    
                 let numSl_bb = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien}).count()
                 UserAllocation[j].numSl_bb = numSl_bb


                let numsl_dtn = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien, cp_trangthai : 1}).count()
                 UserAllocation[j].numsl_dtn = numsl_dtn


                let numsl_cn = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien, cp_trangthai : 0}).count()
                 UserAllocation[j].numsl_cn = numsl_cn


                let numsl_tc  = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien, cp_trangthai : 2}).count()
                 UserAllocation[j].numsl_tc = numsl_tc
                }


                let UserRecall = await ThuHoi.aggregate([
                    {$match: listConditions},
                    {$skip : skip },
                    {$limit : limit },
                    {$sort: {thuhoi_id:-1}},
                    {
                        $lookup: {
                            from: "Users",
                            localField: "id_ng_thuhoi",
                            foreignField: "_id",
                            // pipeline: [
                            //     { $match: {$and : [
                            //     { "type" : {$ne : 1 }},
                            //     {"idQLC":{$ne : 0}},
                            //     {"idQLC":{$ne : 1}}
                            //     ]},
                            //     }
                            // ],
                             as : "info"
                        }
                    },
                    { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },

                    {$project : { 
                        thuhoi_id : 1,
                        thuhoi_trangthai : 1, 
                        id_ng_thuhoi : 1,
                        ten_nguoi_thuhoi : "$info.userName",
                        dep_id : "$info.inForPerson.employee.dep_id",

                    }},
                    
                ])
                for (let t = 0; t < UserRecall.length; t++) { 
                if(UserRecall[t].dep_id != 0 ){
                let depName_cua_nhan_vien = await department.findOne({ com_id: id_cty, dep_id: UserRecall[t].dep_id }) 
                if(depName_cua_nhan_vien) UserRecall[t].depName_cua_nhan_vien = depName_cua_nhan_vien.dep_name
                }
                let numSl_bb = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[t].id_ng_thuhoi}).count()
                UserRecall[t].numSl_bb = numSl_bb
                // listRecall[0].numSl_bb = numSl_bb
                
                let numsl_dtn = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[t].id_ng_thuhoi, thuhoi_trangthai : 1}).count()
                UserRecall[t].numsl_dtn = numsl_dtn
                // listRecall[0].numsl_dtn = numsl_dtn
                
                let numsl_cn = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[t].id_ng_thuhoi, thuhoi_trangthai : 0}).count()
                UserRecall[t].numsl_cn = numsl_cn
                
                let numsl_tc  = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[t].id_ng_thuhoi, thuhoi_trangthai : 2}).count()
                UserRecall[t].numsl_tc = numsl_tc
                }
        let num_Allocation = await capPhat.count(listConditions)
        let num_Recall = await ThuHoi.count(listConditions)
        let totalCount = num_Allocation + num_Recall
        return fnc.success(res, "lấy thành công ",{data,UserAllocation,UserRecall,totalCount})
    }catch(e){ 
        console.error(e)
        return fnc.setError(res, e.message) 
    } 
}

exports.listDetailAllocation = async (req, res) => {
    try{
        const id_cty = req.user.data.com_id
        const id_ng_thuchien = Number(req.body.id_ng_thuchien)
        const cp_id = Number(req.body.cp_id)
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        if(id_ng_thuchien){
        let cond = {}
        cond.id_cty = id_cty
        cond.id_ng_thuchien = id_ng_thuchien
        if(cp_id)cond.cp_id = cp_id
        console.log(cond)
        let data = await capPhat.aggregate([
            {$match: cond},
            {$skip : skip },
            {$limit : limit },
            {$sort: {cp_id:-1}},
            {$lookup: {
                from: "Users",
                localField: "id_ng_thuchien",
                foreignField : "_id",
                as : "info"
            }},
            { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },
            {$lookup: {
                from: "Users",
                localField: "cp_id_ng_tao",
                foreignField : "_id",
                as : "info_nguoi_tao"
            }},
            { $unwind: { path: "$info_nguoi_tao", preserveNullAndEmptyArrays: true } },

            {$project : {
                "cp_id" : "$cp_id",
                "cp_trangthai" : "$cp_trangthai",
                "id_ng_thuchien" : "$id_ng_thuchien",
                "id_nhanvien" : "$id_nhanvien",
                "id_phongban" : "$id_phongban",
                "cp_id_ng_tao" : "$cp_id_ng_tao",
                "cp_date_create" : "$cp_date_create",
                "ten_ng_thuchien" : "$info.userName",
                "ten_ng_tao" : "$info_nguoi_tao.userName",
            }},
            
        ])
        if(data){
            return fnc.success(res, " lấy thành công ",{data})
        }
        return fnc.setError(res, "không tìm thấy đối tượng");
    }
    return fnc.setError(res, "vui lòng nhập id_ng_thuchien ");

    }catch(e){
        return fnc.setError(res, e.message)
    }
}
exports.listDetailRecall = async (req, res) => {
    try{
        const id_cty = req.user.data.com_id
        const id_ng_thuhoi = Number(req.body.id_ng_thuhoi)
        const thuhoi_id = Number(req.body.thuhoi_id)
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize)|| 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        if(id_ng_thuhoi){
        let cond = {}
        cond.id_cty = id_cty
        cond.id_ng_thuhoi = id_ng_thuhoi
        if(thuhoi_id)cond.thuhoi_id = thuhoi_id
        console.log(cond)
        let    data = await ThuHoi.aggregate([
            {$match: cond},
            {$skip : skip },
            {$limit : limit },
            {$sort: {thuhoi_id:-1}},
            {$lookup: {
                from: "Users",
                localField: "id_ng_thuhoi",
                foreignField : "_id",
                as : "info"
            }},
            { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },
            {$lookup: {
                from: "Users",
                localField: "thuhoi_ng_tao",
                foreignField : "_id",
                as : "info_ng_tao"
            }},
            { $unwind: { path: "$info_ng_tao", preserveNullAndEmptyArrays: true } },

            // {$unwind: "$info"},
            {$project : {
                "thuhoi_id" : "$thuhoi_id",
                "thuhoi_ngay" : "$thuhoi_ngay",
                "id_nhanvien" : "$id_ng_dc_thuhoi",
                "id_phongban" : "$id_pb_thuhoi",
                "thuhoi_hoanthanh" : "$thuhoi_hoanthanh",
                "thuhoi_soluong" : "$thuhoi_soluong",
                "thuhoi_ng_tao" : "$thuhoi_ng_tao",
                "id_ng_thuhoi" : "$id_ng_thuhoi",
                "thuhoi_trangthai" : "$thuhoi_trangthai",
                "ten_ng_thuhoi" : "$info.userName",
                "ten_ng_tao" : "$info_ng_tao.userName",
            }},

        ])
        if(data){
            return fnc.success(res, " lấy thành công ",{data})
        }
        return fnc.setError(res, "không tìm thấy đối tượng");
    }
    return fnc.setError(res, "vui lòng nhập id_ng_thuhoi ");

    }catch(e){
        return fnc.setError(res, e.message)
    }
}
//Từ chối thực hiện bàn giao tài sản
exports.refuserHandOver = async (req , res) =>{
    try{
        const id_cty = req.user.data.com_id
        const dc_id = req.body.dc_id
        const content = req.body.content
     if(dc_id){
        const data = await DieuChuyen.findOne({ dc_id: dc_id,id_cty: id_cty });
        if (!data) {
           return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
        } else {
        await DieuChuyen.updateOne({ dc_id: dc_id,id_cty:id_cty }, {
            dc_trangthai : 2,
            dc_lydo_tuchoi : content,
            })
        }
        return fnc.success(res, "cập nhật thành công")
     }
     return fnc.setError(res, "vui lòng nhập dc_id ")

    }catch(e){
        return fnc.setError(res, e.message)
    }
}
//Từ chối bàn giao tài sản cấp phát
// exports.refuserHandOverAllocation = async (req , res) =>{
//     try{
//         const id_cty = req.user.data.com_id
//         const cp_id = req.body.cp_id
//         const content = req.body.content
//         const data = await capPhat.findOne({ cp_id: cp_id,id_cty: id_cty });
//         if (!data) {
//             return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
//          } else {
//              // console.log(data.cap_phat_taisan.ds_ts[0].ts_id)
//              let count = data.cap_phat_taisan.ds_ts[0].ts_id
//              for(let t = 0; t<count.length; t ++){
//                  let listItemsType = await TaiSan.find({ id_cty: id_cty, ts_id : count(t) })
//                      let sl_taisan = listItemsType.soluong_cp_bb + data.cap_phat_taisan.ds_ts[0].sl_cp
//                      await TaiSan.updateOne({ ts_id : count(t),id_cty:id_cty }, {
//                          soluong_cp_bb : sl_taisan,
//                          })
//              }
//             //  await capPhat.updateOne({ cp_id: cp_id,id_cty:id_cty }, {
//             //  cp_trangthai : 2,
//             //  cp_tu_choi_tiep_nhan : content,
//             //  })
//          }
//          return fnc.success(res, "cập nhật thành công")

//     }catch(e){
//         return fnc.setError(res, e.message)
//     }
// }
// //Từ chối tiếp nhận tài sản cấp phát"
// exports.AcceptHandOverAllocation = async (req, res) => {
//     try {
//         const id_cty = req.user.data.com_id
//         const cp_id = req.body.cp_id
//         const content = req.body.content
//         if(cp_id){
//             const data = await capPhat.findOne({ cp_id: cp_id, id_cty: id_cty });

//             if (!data) {
//                 return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật");
//             } else {
//                 let count = data.cap_phat_taisan.ds_ts[0].ts_id
//                 for (let t = 0; t < count.length; t++) {
//                     let listItemsType = await TaiSan.find({ id_cty: id_cty, ts_id: count(t) })
//                     let sl_taisan = listItemsType.ts_so_luong + data.cap_phat_taisan.ds_ts[0].sl_cp
//                     await TaiSan.updateOne({ ts_id: count(t), id_cty: id_cty }, {
//                         ts_so_luong: sl_taisan,
//                         soluong_cp_bb: sl_taisan,
//                     })
//                 }
//                 await capPhat.updateOne({ cp_id: cp_id, id_cty: id_cty }, {
//                     cp_trangthai: 4,
//                     cp_tu_choi_tiep_nhan: content,
//                 })
//                 return fnc.success(res, "cập nhật thành công")
//             }
//         }
//         return fnc.setError(res, "vui lòng nhập cp_id")
        

//     } catch (e) {
//         return fnc.setError(res, e.message)
//     }
// }