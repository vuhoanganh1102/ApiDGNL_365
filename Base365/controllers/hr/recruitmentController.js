const functions = require('../../services/functions');
const Recruitment = require('../../models/hr/Recruitment');
const RecruitmentNews = require('../../models/hr/RecruitmentNews');
const StageRecruitment = require('../../models/hr/StageRecruitment');

exports.getListStageRecruitment= async(req, res, next) => {
    try {
        let {page, pageSize, name} = req.body;
        if(!page || !pageSize){
            return functions.setError(res, "Missing input page or pageSize", 401);
        }
        page = Number(req.body.page);
        pageSize = Number(req.body.pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {};

        // dua dieu kien vao ob listCondition
        if(name) listCondition.name =  new RegExp(name);
        let fieldsGet = 
        {   
            _id: 1,name: 1,createdBy: 1,createdAt: 1,deletedAt: 1,isDelete: 1,applyFor: 1,slug: 1,comId: 1,isCom: 1
        }
        const listStageRecruit = await functions.pageFindWithFields(StageRecruitment, listCondition, fieldsGet, { _id: 1 }, skip, limit); 
        const totalCount = await functions.findCount(StageRecruitment, listCondition);
        return functions.success(res, "Get list stage recruitment success", {totalCount: totalCount, data: listStageRecruit });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.getAndCheckDataStageRecruit = async(req, res, next) => {
    try {
        let image = req.files.image;
        let imageWeb = req.files.imageWeb;
        let {adminId,title,url,des,status,keyword, sapo, active, hot, detailDes , titleRelate, contentRelate, newStatus, date, dateLastEdit} = req.body;
        let fields = [adminId, title, url, image, des,keyword, sapo, detailDes, titleRelate, contentRelate];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
                return functions.setError(res, `Missing input value ${i+1}`, 404);
        }
        // them cac truong muon them hoac sua
        req.info = {
            adminId: adminId,
            title: title,
            url: url,
            image: image,
            des: des,
            status: status,
            keyword: keyword,
            sapo: sapo,
            active: active,
            hot: hot,
            new: newStatus,
            detailDes: detailDes,
            titleRelate: titleRelate,
            contentRelate: contentRelate,
            date: date,
            dateLastEdit: dateLastEdit
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}