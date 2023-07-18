const functions= require ("../../services/functions")
const WorkDay = require("../../models/qlc/CC365_CompanyWorkday")

exports.create = async( req, res )=>{
    try{
        // let com_id = req.user.data.com_id
        let com_id = req.body.com_id
        let num_days = req.body.num_days
        let month = req.body.month
        let year = req.body.year
        if(num_days){
            const apply_month = year +"-"+ month
            const fullMonth = apply_month + "-" + "01"
            let data = await WorkDay.findOne({com_id:com_id, apply_month:fullMonth})
            console.log(data)
            if(!data){
                const max1 = await WorkDay.findOne({}, { cw_id: 1 }).sort({ cw_id: -1 }).limit(1).lean()||0
                const com = new WorkDay({
                    cw_id: Number(max1.cw_id) +1 || 1,
                    num_days:num_days,
                    apply_month:fullMonth,
                    com_id:com_id,
                })
                await com.save()
                return functions.success(res, "Tạo thành công",{data});
            }else{
                //nếu tìm thấy thì cập nhật 
                await WorkDay.updateOne({com_id: com_id,apply_month :fullMonth}, {
                    $set: {
                        num_days:num_days,
                        apply_month:fullMonth,
                        com_id:com_id,
                    }
                })
                return functions.success(res, "cập nhật thành công");
            
            } 
        }
        return functions.setError(res , "nhập thiếu trường")
    }catch(e){
        return functions.setError(res , e.message)
    }
} 