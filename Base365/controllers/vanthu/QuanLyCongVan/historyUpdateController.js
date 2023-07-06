const functions = require('../../../services/functions')
const vanthu = require('../../../services/vanthu.js');
const tbl_qly_congvan = require('../../../models/Vanthu365/tbl_qly_congvan');
const tbl_qlcv_edit = require('../../../models/Vanthu365/tbl_qlcv_edit');


exports.getDataHistory = async (req, res, next) => {
    try {
        let comId = Number(req.comId) || 1763;

        let data = {};

        let countTextUpdate = await tbl_qly_congvan.countDocuments({ cv_type_edit: 1, cv_type_xoa: 0, cv_type_hd: 0, cv_usc_id: comId })

        let countTextRecover = await tbl_qly_congvan.countDocuments({ cv_type_kp: 1, cv_type_xoa: 0, cv_type_hd: 0, cv_usc_id: comId })

        let countContractUpdate = await tbl_qly_congvan.countDocuments({ cv_type_edit: 1, cv_type_xoa: 0, cv_type_hd: 1, cv_usc_id: comId })

        let countContractRecover = await tbl_qly_congvan.countDocuments({ cv_type_kp: 1, cv_type_xoa: 0, cv_type_hd: 1, cv_usc_id: comId })

        let list = await tbl_qly_congvan.find({ $or: [{ cv_type_kp: 1}, {cv_type_edit: 1 }], cv_type_xoa: 0, cv_usc_id: comId },
            {
                cv_id: 1, cv_so: 1, cv_name: 1, cv_type_edit: 1, 
                cv_type_kp: 1, cv_type_user_kp: 1, cv_user_kp: 1,
                cv_type_user_kp: 1, cv_user_kp: 1, cv_time_edit: 1, cv_time_kp: 1
            }).limit(6)

        data.countTextUpdate = countTextUpdate;
        data.countTextRecover = countTextRecover;
        data.countContractUpdate = countContractUpdate;
        data.countContractRecover = countContractRecover;
        data.list = list;
        return functions.success(res, 'get data success', { data })
    } catch (error) {
        console.error(err);
        return functions.setError(res, error)
    }
}

exports.getDetailHistoryUpdate = async (req,res,next) => {
    try {
        let id = Number(req.body.id);
        let comId = req.body.comId || 1763;
        let page = Number(req.body.page) || 1;
        let pageSize = Number(req.body.pageSize) || 10;
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        let type_vb = Number(req.body.type_vb);
        let name_vb = req.body.name_vb;
        let date_start = new Date(req.body.date_start).getTime() / 1000;
        let date_end = new Date(req.body.date_end).getTime() / 1000;
        let type_book = Number(req.body.type_book);
        let type = Number (req.body.type);
        if(!type) return functions.setError(res,'missing type',400)
      
        let conditions = {};
        switch (type_vb ) {
            case 1:
                conditions.cv_type_loai = 1
                conditions.cv_type_hd = 0
            case 2:
                conditions.cv_type_loai = 2
                conditions.cv_type_hd = 0
            case 3:
                conditions.cv_type_loai = 1
                conditions.cv_type_hd = 1
            case 4:
                conditions.cv_type_loai = 2
                conditions.cv_type_hd = 1
            case 5:
                conditions.cv_type_hd = 1
            default:
                conditions.cv_type_hd = 0
        } 
        if(type_book)   conditions.cv_date_book = type_book;  
        if (date_start) conditions.cv_date = { $gte: date_start }
        if (date_end) conditions.cv_date = { $lte: date_end }
        if(date_start && date_end) conditions.cv_date = { $gte: date_start, $lte: date_end }
        conditions.cv_usc_id = comId
        conditions.cv_type_xoa = 0
        if(type ===  1){
            conditions.cv_type_edit = 1
        }else if(type === 2){
            conditions.cv_type_kp = 1 
        }
        if(name_vb){
            conditions.cv_name_vb = {$regex: name_vb}
        }
        let data = await tbl_qly_congvan.find(conditions).skip(skip).limit(limit);
        return functions.success(res,'get data success',{data})
    } catch (error) {
        console.error(error);
        return functions.setError(res,error)
    }
}