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
        
        let listCondition = {comId: req.comId};

        // dua dieu kien vao ob listCondition
        if(name) listCondition.name =  new RegExp(name);
        const listRecruit = await functions.pageFind(Recruitment, listCondition, { _id: 1 }, skip, limit); 
        const totalCount = await functions.findCount(Recruitment, listCondition);
        return functions.success(res, "Get list recruitment success", {totalCount: totalCount, data: listRecruit });
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
        //tao quy trinh
        // let createBy = req.infoLogin?'Công ty' : infoLogin.name
        let recruitment = new Recruitment({
            // id: 11,
            name: nameProcess,
            createdBy: 'Công ty',
            createdAt: Date.now(),
            applyFor: applyFor,
            slug: slug,
            comId: comId,
            isCom: 1
        });
        recruitment = await recruitment.save();
        console.log(recruitment);

        //tao cac giai doan cua quy trinh do
        let stageRecruit = new StageRecruitment({
            id: 1,
            recruitmentId: recruitment.id,
            name: nameStage,
            positionAssumed: posAssum,
            target: target,
            completeTime: time,
            description: Buffer.from(des, 'base64')
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

exports.softDeleteRecruitment = async(req, res, next) => {
    try {
        let recruitmentId = req.query.recruitmentId;
        let recruitment = await Recruitment.findOneAndUpdate({id: recruitmentId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!recruitment) {
            return functions.setError(res, "News not found!", 505);
        }
        return functions.success(res, "Soft delete recruitment success!");
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

//------------------------------controller recruitment new----------------------
exports.getListRecruitmentNews= async(req, res, next) => {
    try {
        let {page, pageSize, title, fromDate, toDate} = req.body;

        //id company lay ra sau khi dang nhap
        let comId = req.comId;
        if(!page || !pageSize){
            return functions.setError(res, "Missing input page or pagesize", 401);
        }
        
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {isDelete: 0};
        // dua dieu kien vao ob listCondition
        if(title) listCondition.title =  new RegExp(title);
        if(comId) listCondition.comId =  Number(comId);
        if(fromDate) listCondition.timeStart = {$gte: fromDate};
        if(toDate) listCondition.timeEnd = {$lte: toDate};
        console.log(listCondition);

        const listRecruitmentNews = await functions.pageFind(RecruitmentNews, listCondition, { _id: 1 }, skip, limit);
        const totalCount = await functions.findCount(RecruitmentNews, listCondition);
        return functions.success(res, "get list blog success", {totalCount: totalCount, data: listRecruitmentNews });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}



exports.checkDataRecruitmentNews = async(req, res, next) => {
    try {
        let {
                title,posApply,cityId,address,cateId,salaryId,number,timeStart,timeEnd,jobDetail,wokingForm,probationaryTime,moneyTip,
                jobDes,interest,recruitmentId,jobExp,degree,gender,jobRequire,memberFollow,hrName,comId,isCom,createdBy
            } = req.body;
        let fields = [
                title,posApply,cityId,cateId,salaryId,number,timeStart,timeEnd,jobDetail,wokingForm,
                jobDes,interest,recruitmentId,jobExp,degree,gender,jobRequire,memberFollow,hrName
            ]
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
                return functions.setError(res, `Missing input value ${i+1}`, 404);
        }
        // them cac truong muon them hoac sua
        req.info = {
            title: title,
            posApply: posApply,
            cityId: cityId,
            address: address,
            cateId: cateId,
            salaryId: salaryId,
            number: number,
            timeStart: timeStart,
            timeEnd: timeEnd,
            jobDetail: jobDetail,
            wokingForm: wokingForm,
            probationaryTime: probationaryTime,
            moneyTip: moneyTip,
            jobDes: jobDes,
            interest: interest,
            recruitmentId: recruitmentId,
            jobExp: jobExp,
            degree: degree,
            gender: gender,
            jobRequire: jobRequire,
            memberFollow: memberFollow,
            hrName: hrName
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createRecruitmentNews = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;

        //them cac truong an
        fields.createdAt = Date.now();
        fields.comId = req.comId;
        fields.createBy = 'Công ty';
        fields.isCom = 1;
        console.log(req.comId);
        //tao 
        // let recruitmentNews = new RecruitmentNews(fields);
        // await recruitmentNews.save();
        return functions.success(res, 'Create recruitmentNews RN365 success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateRecruitmentNews = async(req, res, next) => {
    try{
        let recruitmentNewsId = req.body.recruitmentNewsId;
        if(!recruitmentNewsId)
            return functions.setError(res, "Missing input id news!", 404);
        let fields = req.info;
        fields.updatedAt = Date.now();
        let recruitmentNews = await RecruitmentNews.findOneAndUpdate({id: recruitmentNewsId}, fields);
        if(!recruitmentNews) {
            return functions.setError(res, "Recruitment News not found!", 505);
        }
        return functions.success(res, "Update news success!");
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.softDeleteRecuitmentNews = async(req, res, next) =>{
    try{
        let newsId = req.query.newsId;
        let recruitmentNews = await RecruitmentNews.findOneAndUpdate({id: newsId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!recruitmentNews) {
            return functions.setError(res, "News not found!", 505);
        }
        return functions.success(res, "Soft delete news success!");
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}