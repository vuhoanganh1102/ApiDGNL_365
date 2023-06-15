const functions = require('../../services/functions');
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

        let encodedDes = Buffer.from(des, 'base64');
        console.log(encodedDes); // V2VsY29tZSB0byBmcmVlQ29kZUNhbXAh
        const maxIdRecruit = await Recruitment.findOne({}, { _id: 1 }).sort({ _id: -1 }).limit(1).lean();
        let newIdRecruit;
        if (maxIdRecruit) {
            newIdRecruit = Number(maxIdRecruit._id) + 1;
        } else newIdRecruit = 1;

        //tao quy trinh
        let recruitment = new Recruitment({
            name: nameProcess,
            createdBy: "Cong ty",
            createdAt: Date.now(),
            applyFor: applyFor,
            comId: comId,
            isCom: 1
        });
        await Recruitment.create(recruitment);

        //tao cac giai doan cua quy trinh do
        let stageRecruit = new StageRecruitment({
            recruitmentId: newIdRecruit,
            name: nameStage,
            positionAssumed: posAssum,
            target: target,
            completeTime: time,
            description: encodedDes
        });
        await StageRecruitment.create(stageRecruit);
        return functions.success(res, 'Create recruitment success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}