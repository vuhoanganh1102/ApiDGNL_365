const CV = require('../../models/Timviec365/CV/CV');
const axios = require('axios');
const functions=require('../../services/functions');


// insert CV
exports.insertDataCV = async (req, res, next) => {
    try{
        const data =  await functions.getDataAxios('https://timviec365.vn/cv365/api_nodejs/get_tbl_cv.php?page=1',{});
            await data.forEach(element => {
                const oldId = element.id;
                delete element.id;
                element._id = oldId;
                CV.create(element)
            });
            return await functions.success(res,"Thành công");
    } catch(err){
        functions.setError(res,err.message);
    };
};

// lấy tất cả danh sách mẫu CV
exports.getListCV = async (req, res, next) => {
    try {
        const data = await functions.getDataCV();
        if(data) {
            return await functions.success(res,'Lấy mẫu CV thành công',data);
        };
        return functions.setError(res,'Không có dữ liệu');
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// lấy theo điều kiện
exports.getListCVByCondition = async (req, res, next) => {
    try{
        const cate_id =  req.query.cate_id;
        const lang_id =  req.query.lang_id;
        const design_id =  req.query.design_id;
        let sort = req.query.sort;
        let data = [];
        
        if(sort === 'download') {
             if(cate_id) {
            data = await functions.getDataCV({cate_id: cate_id},{download:-1});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        if(lang_id) {
            data = await functions.getDataCV({lang_id: lang_id},{download:-1});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        if(design_id) {
            data = await functions.getDataCV({design_id: design_id},{download:-1});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        return functions.setError(res,'Không có dữ liệu',404);

        }
        if(cate_id) {
            data = await functions.getDataCV({cate_id: cate_id});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        if(lang_id) {
            data = await functions.getDataCV({lang_id: lang_id});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        if(design_id) {
            data = await functions.getDataCV({design_id: design_id});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        return functions.setError(res,'Không có dữ liệu',404);
    } catch(e){
        functions.setError(res, e.message);
    }
};

