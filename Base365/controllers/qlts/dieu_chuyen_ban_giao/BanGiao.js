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
        let numAllocaction = await capPhat.distinct('id_ng_thuchien', { id_cty: id_cty, cp_da_xoa: 0 }).count()
        let numRecall = await ThuHoi.distinct('id_ng_thuhoi', { id_cty: id_cty, xoa_thuhoi: 0 }).count()
        let transferLocate = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0,dc_type :0}).count()
        let transferObject = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0,dc_type :0}).count()
        let transferManagerUnit = await DieuChuyen.find({id_cty: id_cty ,xoa_dieuchuyen : 0, dc_type :0}).count()
        if(numAllocaction) data.push({numAllocaction: numAllocaction})
        if(numRecall)  data.push({numRecall: numRecall})
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
                    {$sort: {cp_id:-1}},
                    {$skip : skip/2 },
                    {$limit : limit/2 },
                    {$lookup: {
                        from: "Users",
                        localField: "id_ng_thuchien",
                        foreignField : "idQLC",
                        as : "info"
                    }},
                    {$unwind: "$info"},
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
                    {$sort: {thuhoi_id:-1}},
                    {$skip : skip/2 },
                    {$limit : limit/2 },
                    {$lookup: {
                        from: "Users",
                        localField: "id_ng_thuhoi",
                        foreignField : "idQLC",
                        as : "info"
                    }},
                    {$unwind: "$info"},
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
            {$lookup: {
                from: "Users",
                localField: "id_ng_thuchien",
                foreignField : "idQLC",
                as : "info"
            }},
            {$unwind: "$info"},
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
            
        ]).skip(skip).limit(limit)
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
            {$lookup: {
                from: "Users",
                localField: "id_ng_thuhoi",
                foreignField : "idQLC",
                as : "info"
            }},
            {$unwind: "$info"},
            {$project : {
                "thuhoi_id" : "$thuhoi_id",
                "thuhoi_ngay" : "$thuhoi_ngay",
                "id_nhanvien" : "$id_ng_dc_thuhoi",
                "id_phongban" : "$id_pb_thuhoi",
                "thuhoi_hoanthanh" : "$thuhoi_hoanthanh",
                "thuhoi_soluong" : "$thuhoi_soluong",
                "thuhoi_ng_tao" : "$thuhoi_ng_tao",
                "thuhoi_trangthai" : "$thuhoi_trangthai",
                "ten_ng_thuhoi" : "$info.userName",
            }},

        ]).skip(skip).limit(limit)
        if(data){
            return fnc.success(res, " lấy thành công ",{data})
        }
        return fnc.setError(res, "không tìm thấy đối tượng", 510);
    }catch(e){
        return fnc.setError(res, e.message)
    }
}