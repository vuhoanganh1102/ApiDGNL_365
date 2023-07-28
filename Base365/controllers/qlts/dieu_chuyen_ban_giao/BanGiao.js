const DieuChuyen = require("../../../models/QuanLyTaiSan/DieuChuyen");
const fnc = require("../../../services/functions");
// const thongBao = require('../../../models/QuanLyTaiSan/ThongBao')
const capPhat = require('../../../models/QuanLyTaiSan/CapPhat')
const ThuHoi = require('../../../models/QuanLyTaiSan/ThuHoi')


exports.list = async (req, res) => {
    try{
        const id_cty = req.user.data.com_id
        const id_ng_thuchien = req.body.id_ng_thuchien
        const id_ng_thuhoi = req.body.id_ng_thuhoi
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;

        let data = []
        let listConditions = {};
        listConditions.id_cty = id_cty
        if(id_ng_thuchien) listConditions.id_ng_thuchien = id_ng_thuchien
        if(id_ng_thuhoi) listConditions.id_ng_thuhoi = id_ng_thuhoi
        let numAllocaction = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 })
        let numRecall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 })
        let dem_bg = (numAllocaction.length + numRecall.length)
        let transferLocate = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0,dc_type :0}).count()
        let transferObject = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0,dc_type :1}).count()
        let transferManagerUnit = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0, dc_type :2}).count()
        if(dem_bg)  data.push({dem_bg: dem_bg})
        if(transferLocate)  data.push({transferLocate: transferLocate})
        if(transferObject) data.push({transferObject: transferObject})
        if(transferManagerUnit) data.push({transferManagerUnit: transferManagerUnit})

        //query find user hand over 

        let allocation = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 })
        let recall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 })
        if(allocation) data.push({queryAllocation: allocation})
        if(recall) data.push({queryRecall: recall})

        // end Query
        let listAllocation = await capPhat.distinct('id_ng_thuchien',listConditions )
        let dataAllocation = {}
        if(listAllocation) {
            for (let i = 0; i < listAllocation.length; i++) {
                let UserAllocation = await capPhat.aggregate([
                    {$match: {id_cty: id_cty,id_ng_thuchien:listAllocation[i],id_ng_thuchien : {$ne: 0}}},
                    {$skip : skip/2 },
                    {$limit : limit/2 },
                    {$sort: {cp_id:-1}},
                    {$lookup: {
                        from: "Users",
                        localField: "id_ng_thuchien",
                        foreignField : "idQLC",
                        as : "info"
                    }},
                    { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },

                    // {$unwind: "$info"},
                    {$project : {
                        "cp_id" : "$cp_id",
                        "cp_trangthai" : "$cp_trangthai",
                        "id_ng_thuchien" : "$id_ng_thuchien",
                        "ten_ng_thuchien" : "$info.userName",
                    }},
                    
                ])
                // results1.push({UserAllocation: UserAllocation[0]})
                for (let j = 0; j < UserAllocation.length; j++) {
                   
                 let numSl_bb = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien}).count()
                //  results1.push({numSl_bb: numSl_bb})
                 UserAllocation[j].numSl_bb = numSl_bb


                let numsl_dtn = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien, cp_trangthai : 1}).count()
                // results1.push({numsl_dtn: numsl_dtn})
                 UserAllocation[j].numsl_dtn = numsl_dtn


                let numsl_cn = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien, cp_trangthai : 0}).count()
                // results1.push({numsl_cn: numsl_cn})
                 UserAllocation[j].numsl_cn = numsl_cn


                let numsl_tc  = await capPhat.find({id_cty:id_cty,id_ng_thuchien: UserAllocation[j].id_ng_thuchien, cp_trangthai : 2}).count()
                // results1.push({numsl_tc: numsl_tc})
                 UserAllocation[j].numsl_tc = numsl_tc
                }
                dataAllocation.UserAllocation = UserAllocation

            }
        }
        let listRecall = await ThuHoi.distinct('id_ng_thuhoi',listConditions )
        let dataRecall ={}
        if(listRecall) {
            for (let i = 0; i < listRecall.length; i++) {
                let UserRecall = await ThuHoi.aggregate([
                    {$match: {id_cty: id_cty,id_ng_thuhoi:listRecall[i],id_ng_thuhoi : {$ne: 0}}},
                    {$skip : skip/2 },
                    {$limit : limit/2 },
                    {$sort: {thuhoi_id:-1}},
                    {$lookup: {
                        from: "Users",
                        localField: "id_ng_thuhoi",
                        foreignField : "idQLC",
                        as : "info"
                    }},
                    { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },

                    {$project : {
                        "thuhoi_id" : "$thuhoi_id",
                        "thuhoi_trangthai" : "$thuhoi_trangthai",
                        "id_ng_thuhoi" : "$id_ng_thuhoi",
                        "ten_nguoi_thuhoi" : "$info.userName",
                    }},
                    
                ])
                for (let j = 0; j < UserRecall.length; j++) {
                
                let numSl_bb = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[j].id_ng_thuhoi}).count()
                UserRecall[j].numSl_bb = numSl_bb
                // listRecall[0].numSl_bb = numSl_bb
                
                let numsl_dtn = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[j].id_ng_thuhoi, thuhoi_trangthai : 1}).count()
                UserRecall[j].numsl_dtn = numsl_dtn
                // listRecall[0].numsl_dtn = numsl_dtn
                
                let numsl_cn = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[j].id_ng_thuhoi, thuhoi_trangthai : 0}).count()
                UserRecall[j].numsl_cn = numsl_cn
                
                let numsl_tc  = await ThuHoi.find({id_cty:id_cty,id_ng_thuhoi: UserRecall[j].id_ng_thuhoi, thuhoi_trangthai : 2}).count()
                UserRecall[j].numsl_tc = numsl_tc
                }
                dataRecall.UserRecall = UserRecall

            }
        }
        data.push({dataAllocation: dataAllocation})
        data.push({dataRecall: dataRecall})
        // console.log(results1.length/5 )
        
        return fnc.success(res, "lấy thành công ",{data})
    }catch(e){
        return fnc.setError(res, e.message)
    }
}

exports.listDetailAllocation = async (req, res) => {
    try{
        const id_cty = req.user.data.com_id
        const id_ng_thuchien = Number(req.body.id_ng_thuchien)
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let data = await capPhat.aggregate([
            {$match: {id_cty: id_cty,id_ng_thuchien:id_ng_thuchien}},
            {$skip : skip },
            {$limit : limit },
            {$sort: {cp_id:-1}},
            {$lookup: {
                from: "Users",
                localField: "id_ng_thuchien",
                foreignField : "idQLC",
                as : "info"
            }},
            { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },

            {$project : {
                "cp_id" : "$cp_id",
                "cp_trangthai" : "$cp_trangthai",
                "id_ng_thuchien" : "$id_ng_thuchien",
                "id_nhanvien" : "$id_nhanvien",
                "id_phongban" : "$id_phongban",
                "cp_id_ng_tao" : "$cp_id_ng_tao",
                "cp_date_create" : "$cp_date_create",
                "ten_ng_thuchien" : "$info.userName",
            }},
            
        ])
        if(data){
            return fnc.success(res, " lấy thành công ",{data})
        }
        return fnc.setError(res, "không tìm thấy đối tượng", 510);
    }catch(e){
        return fnc.setError(res, e.message)
    }
}
exports.listDetailRecall = async (req, res) => {
    try{
        const id_cty = req.user.data.com_id
        const id_ng_thuhoi = Number(req.body.id_ng_thuhoi)
        let page = Number(req.body.page)|| 1;
        let pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let    data = await ThuHoi.aggregate([
            {$match: {id_cty: id_cty, id_ng_thuhoi:id_ng_thuhoi}},
            {$skip : skip },
            {$limit : limit },
            {$sort: {thuhoi_id:-1}},
            {$lookup: {
                from: "Users",
                localField: "id_ng_thuhoi",
                foreignField : "idQLC",
                as : "info"
            }},
            { $unwind: { path: "$info", preserveNullAndEmptyArrays: true } },

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
            }},

        ])
        if(data){
            return fnc.success(res, " lấy thành công ",{data})
        }
        return fnc.setError(res, "không tìm thấy đối tượng", 510);
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
    }catch(e){
        return fnc.setError(res, e.message)
    }
}
//Từ chối bàn giao tài sản cấp phát
exports.refuserHandOverAllocation = async (req , res) =>{
    try{
        const id_cty = req.user.data.com_id
        const cp_id = req.body.cp_id
        const content = req.body.content
        const data = await capPhat.findOne({ cp_id: cp_id,id_cty: id_cty });
        if (!data) {
            return fnc.setError(res, "không tìm thấy đối tượng cần cập nhật", 510);
         } else {
             // console.log(data.cap_phat_taisan.ds_ts[0].ts_id)
             let count = data.cap_phat_taisan.ds_ts[0].ts_id
             for(let t = 0; t<count.length; t ++){
                 let listItemsType = await TaiSan.find({ id_cty: id_cty, ts_id : count(t) })
                     let sl_taisan = listItemsType.soluong_cp_bb + data.cap_phat_taisan.ds_ts[0].sl_cp
                     await TaiSan.updateOne({ ts_id : count(t),id_cty:id_cty }, {
                         soluong_cp_bb : sl_taisan,
                         })
             }
            //  await capPhat.updateOne({ cp_id: cp_id,id_cty:id_cty }, {
            //  cp_trangthai : 2,
            //  cp_tu_choi_tiep_nhan : content,
            //  })
         }
         return fnc.success(res, "cập nhật thành công")

    }catch(e){
        return fnc.setError(res, e.message)
    }
}