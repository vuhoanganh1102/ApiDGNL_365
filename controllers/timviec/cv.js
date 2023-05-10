const jwt = require('jsonwebtoken');

const CV = require('../../models/Timviec365/CV/CV');
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
        const data = await functions.getDataCV({},{});
        if(data) {
            return await functions.success(res,'Lấy mẫu CV thành công',data);
        };
        return functions.setError(res,'Không có dữ liệu');
    } catch (err) {
        functions.setError(res, err.message);
    };
};

// lấy theo điều kiện --- func getDataCV nhận 2 tham số là điều kiện và cách sắp xếp( cập nhật mới hoặc download)
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
        return functions.setError(res,'Không có dữ liệu');

        }
        if(cate_id) {
            data = await functions.getDataCV({cate_id: cate_id},{});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        if(lang_id) {
            data = await functions.getDataCV({lang_id: lang_id},{});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        if(design_id) {
            data = await functions.getDataCV({design_id: design_id},{});
            if(data) {
                return await functions.success(res,'Lấy mẫu CV thành công',data);
            };
        };
        return functions.setError(res,'Không có dữ liệu');
    } catch(e){
        functions.setError(res, e.message,404);
    }
};

//xem trước CV
exports.previewCV = async (req, res, next) => {
    try{
        const _id = req.params._id;
        const data = await CV.findOne({_id:_id}).select('_id lang_id name image mota_cv colors view ');

        if(data){
            let view = data.view + 1;    // cập nhật số lượng xem 
            await CV.updateOne({_id:_id},{view:view});

           return await functions.success(res,'Lấy mẫu cv thành công',data); 
        }
        return functions.setError(res,'Không có dữ liệu');
    } catch(e) {
        functions.setError(res, e.message,404);
    };

};

// chi tiết cv
exports.detailCV = async (req, res, text) => {
    try{
        const _id = req.query._id;
        const lang_id= req.query.lang_id;

        // lang_id: 0,1,2,3,4,5 tương ứng tất cả, việt, anh, nhật, trung, hàn 
        const html = ['html_vi html_en html_jp html_cn html_kr','html_vi', 'html_en', 'html_jp', 'html_cn', 'html_kr'];
        const html_lang = html[lang_id];
        const data = await CV.findOne({_id:_id}).select(`_id name ${html_lang}`);

        if(!data){
            await functions.setError(res, 'Không có dữ liệu',);
        }
        return await functions.success(res,'Lấy CV thành công',data);
    } catch(e){
        functions.setError(res, e.message,404);
    };
};

//lưu và tải cv
exports.createCV = async (req, res, next) => {
    try{
        const token = jwt.verify(req.headers.token, 'token', (err, decoded) => {
            if (err) {
              console.error(err);
            } else {
              return decoded;
            }
          });
        

    } catch(e){
        functions.setError(res, e.message, 404);
    }
};
