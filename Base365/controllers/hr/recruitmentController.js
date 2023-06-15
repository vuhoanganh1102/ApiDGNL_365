const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const Recruitment = require('../../models/hr/Recruitment');
const RecruitmentNews = require('../../models/hr/RecruitmentNews');
const StageRecruitment = require('../../models/hr/StageRecruitment');


// lay ra danh sach tat ca cac quy trinh tuyen dung cua cty
exports.getListRecruitment= async(req, res, next) => {
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

exports.createRecruitment = async(req, res, next) => {
    try {
        let {comId, nameProcess, applyFor ,nameStage, posAssum, target, time, des} = req.body;
        if(!nameProcess || !applyFor || !nameStage || !posAssum || !target) {
            return functions.setError(res, "Missing input value!", 404);
        }
        let slug = hrService.titleToSlug(nameProcess);
        console.log(slug);
        //tao quy trinh
        let recruitment = new Recruitment({
            // id: 11,
            name: nameProcess,
            createdBy: "Cong ty",
            createdAt: Date.now(),
            applyFor: applyFor,
            comId: comId,
            isCom: 1
        });
        // recruitment = await recruitment.save();
        // console.log(recruitment);

        //tao cac giai doan cua quy trinh do
        let stageRecruit = new StageRecruitment({
            id: 1,
            recruitmentId: 1,
            name: nameStage,
            positionAssumed: posAssum,
            target: target,
            completeTime: time,
            description: encodedDes
        });
        // await StageRecruitment.create(stageRecruit);
        return functions.success(res, 'Create recruitment success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateRecruitment = async(req, res, next) => {
    try{
        let {recruitId, nameProcess, applyFor} = req.body;
        if(!recruitId || !nameProcess || !applyFor) {
            return functions.setError(res, "Missing input vlaue!", 404);
        }
        const recruit = await Recruitment.findOneAndUpdate({id: recruitId}, {
            name: nameProcess,
            applyFor: applyFor
        })
        if(!recruit) {
            return functions.setError(res, "Recruitment not found!", 505);
        }
        return functions.success(res, "update recruitment success!");
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateStatusDeleteRecruitment = async(req, res, next) => {
    try {
        let recruitId = Number(req.query.recruitId);
        let recruit = await Recruitment.findOne({id: recruitId}, {isDelete: 1});
        if(!recruit) {
            return functions.setError(res, "Recruitment not found!", 505);
        }
        let isDelete = 0;
        if(recruit.isDelete == 0) isDelete=1;

        //
        await Recruitment.findOneAndUpdate({id: recruitId}, {
            deletedAt: Date.now(),
            isDelete: isDelete
        })
        return functions.success(res, "Delete temporary recruitment success!");
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

exports.deleteRecruitment = async(req, res, next) => {
    try {
        let recruitId = Number(req.query.recruitId);
        if(!recruitId){
            return functions.success(res, "Missing input value id", 404);
        }
        let recruitment = await functions.getDataDeleteOne(Recruitment ,{id: recruitId});
        if (recruitment.deletedCount===1) {
            return functions.success(res, `Delete recruitment with _id=${recruitId} success`);
        }
        return functions.success(res, "Recruitment not found");
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}