const functions = require('../../services/functions');
const Mat = require('../../models/QuanLyTaiSan/Mat');

exports.getListDataLostAssets = async (req,res,next) => {
    try {
        let keyword = req.body.keyword;
        let page  = req.body.page;
        let pageSize = req.body.pageSize;
        let skip =(page - 1) * pageSize;
        let limit = pageSize;
        return functions.success(res,'get data success',{data})
    } catch (error) {
        return functions.setError(res,error);
    }
};