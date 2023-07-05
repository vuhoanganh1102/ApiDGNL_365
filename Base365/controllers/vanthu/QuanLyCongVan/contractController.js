const functions = require('../../../services/functions')
const vanthu = require('../../../services/vanthu.js');
const tbl_qly_congvan = require('../../../models/Vanthu365/tbl_qly_congvan');

exports.getListContract = async (req, res, next) => {
    try {
        let key = req.body.key;
        if (key) {
            key = key.toUpperCase();
        }
        let page = Number(req.body.page);
        let pageSize = Number(req.body.pageSize);

        let book = req.body.book;
        let money_min  = req.body.money_min;
        let money_max  = req.body.money_max;
      
        let dayStart = req.body.dayStart;
        let dayEnd = req.body.dayEnd;
        let status = req.body.status;

        let comId = req.comId || 1763;
        let type = Number(req.body.type);
        //tạo phân trang
        let skip = (page - 1) * pageSize;
        let limit = pageSize;
        // khai báo điều kiện, đầu ra
        let data = {};
        let conditions = {};
        if (key) {
            conditions = {
                $or: [
                    { cv_name: { $regex: key } },
                    { cv_so: { $regex: key } }
                ]
            }
        }
        if (dayStart) conditions.cv_date = { $gte: dayStart}
        if (dayEnd) conditions.cv_date = { $lte: dayEnd}
        if (book) conditions.cv_id_book = book
        if (status) conditions.cv_status_hd = status
        if (money_min) conditions.cv_money = { $gte: money_min}
        if (money_max) conditions.cv_money = { $lte: money_max}
        conditions.cv_type_hd = 1;
        conditions.cv_type_xoa = 0;
        if (type === 1) {
            conditions.cv_type_loai = 1;
        } else {
            conditions.cv_type_loai = 2;
        }
        let db_qr = await tbl_qly_congvan.find(conditions).sort({ cv_date: -1 }).skip(skip).limit(limit);
        let count =  await tbl_qly_congvan.countDocuments(conditions)
        data.count = count;
        data.db_qr = db_qr;
        return functions.success(res,'get data success',{data})
    } catch (error) {
        console.error(error);
        return functions.setError(res,error)
    }
};