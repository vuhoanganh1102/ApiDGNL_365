const functions = require('../../services/functions');
const hrService = require('../../services/hr/hrService');
const Recruitment = require('../../models/hr/Recruitment');
const RecruitmentNews = require('../../models/hr/RecruitmentNews');
const StageRecruitment = require('../../models/hr/StageRecruitment');
const Candidate = require('../../models/hr/Candidates');
const ProcessInterview = require('../../models/hr/ProcessInterview');
const InviteInterview = require('../../models/hr/InviteInterview');
const ScheduleInterview = require('../../models/hr/ScheduleInterview');
const ContactJob = require('../../models/hr/ContactJob');
const CancelJob = require('../../models/hr/CancelJob');
const FailJob = require('../../models/hr/FailJob');

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
        let infoLogin = req.infoLogin;
        let listCondition = {comId: infoLogin.comId};
        console.log(listCondition);
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

        //tao slug
        let slug = hrService.titleToSlug(nameProcess);

        //lay id max
        const maxIdRecruit = await Recruitment.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdRecruit;
        if (maxIdRecruit) {
            newIdRecruit = Number(maxIdRecruit.id) + 1;
        } else newIdRecruit = 1;

        //tao quy trinh
        let recruitment = new Recruitment({
            id: newIdRecruit,
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
        let stageRecruitmentId = req.query.stageRecruitmentId;
        let stagerecruitment = await StageRecruitment.findOneAndUpdate({id: stageRecruitmentId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!stagerecruitment) {
            return functions.setError(res, "News not found!", 505);
        }
        return functions.success(res, "Soft delete stage recruitment success!");
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

//----------------------------giai doan trong quy trinh tuyen dung

//lay ra thong tin cac gia doan cua quy trinh or thong tin 1 quy trinh
exports.getStageRecruitment = async(req, res, next) => {
    try{
        let stageRecruitId = req.body.stageRecruitId;
        let recruitmentId = req.body.recruitmentId;
        var data = {};
        if(stageRecruitId){
            data = await StageRecruitment.findOne({id: stageRecruitId});
            if(!data) {
                return functions.setError(res, "Stage recruitment not found!", 503);
            }
        }else if(recruitmentId){
            let recruitment = await Recruitment.findOne({id: recruitmentId});
            if(!recruitment){
                return functions.setError(res, "Recruitment not found!", 504);
            }
            
            data.recruitment = recruitment.name;
            let listStage = await StageRecruitment.find({recruitmentId: recruitmentId});
            data.listStage = listStage;
        }
        else {
            return functions.setError(res, "Missing input value!", 404);
        }
        return functions.success(res, "get stage recruitment success!", {data: data});
    }catch(e){
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}
//them moi giai doan
exports.createStageRecruitment = async(req, res, next) => {
    try {
        let {recruitmentId ,nameStage, posAssum, target, time, des} = req.body;
        if(!recruitmentId || !nameStage || !posAssum || !target) {
            return functions.setError(res, "Missing input value!", 404);
        }
        //lay id max
        const maxIdStageRecruit = await StageRecruitment.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdStageRecruit;
        if (maxIdStageRecruit) {
            newIdStageRecruit = Number(maxIdStageRecruit.id) + 1;
        } else newIdStageRecruit = 1;
        
        //tao cac giai doan cua quy trinh do
        let stageRecruit = new StageRecruitment({
            id: newIdStageRecruit,
            recruitmentId: recruitmentId,
            name: nameStage,
            positionAssumed: posAssum,
            target: target,
            completeTime: time,
            description: Buffer.from(des, 'base64')
        });
        await StageRecruitment.create(stageRecruit);
        return functions.success(res, 'Create stage recruitment success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateStageRecruitment = async(req, res, next) => {
    try {
        let {stageRecruitmentId ,nameStage, posAssum, target, time, des} = req.body;
        if(!stageRecruitmentId || !nameStage || !posAssum || !target) {
            return functions.setError(res, "Missing input value!", 404);
        }
        //
        const stageRecruit = await StageRecruitment.findOneAndUpdate({id: stageRecruitmentId}, {
            name: nameStage,
            positionAssumed: posAssum,
            posAssum: posAssum,
            target: target,
            completeTime: time,
            description: des
        })
        if(!stageRecruit) {
            return functions.setError(res, "Stage recruitment not found!", 505);
        }
        return functions.success(res, "update state recruitment success!");
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.softDeleteStageRecruitment = async(req, res, next) => {
    try {
        let stageRecruitmentId = req.body.stageRecruitmentId;
        let recruitment = await StageRecruitment.findOneAndUpdate({id: stageRecruitmentId}, {
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
        if(fromDate) listCondition.timeStart = {$gte: new Date(fromDate)};
        if(toDate) listCondition.timeEnd = {$lte: new Date(toDate)};

        var listRecruitmentNews = await functions.pageFind(RecruitmentNews, listCondition, { _id: 1 }, skip, limit);
        for(let i=0; i<listRecruitmentNews.length; i++){
            let numberCandi = await Candidate.countDocuments({recruitmentNewsId: listRecruitmentNews[i].id});
            listRecruitmentNews[i].numberCandidate = numberCandi;
        }
        
        const totalCount = await functions.findCount(RecruitmentNews, listCondition);
        return functions.success(res, "Get list recruitment news success", {totalCount: totalCount, data: listRecruitmentNews });
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
        fields.createdBy = 'Công ty';
        fields.isCom = 1;

        //lay id max
        const maxIdNews = await RecruitmentNews.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdNews;
        if (maxIdNews) {
            newIdNews = Number(maxIdNews.id) + 1;
        } else newIdNews = 1;
        fields.id = newIdNews;

        //tao 
        let recruitmentNews = new RecruitmentNews(fields);
        await recruitmentNews.save();
        return functions.success(res, 'Create recruitmentNews success!');
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

//---------------------------------ung vien


exports.getListCandidate= async(req, res, next) => {
    try {
        let {page, pageSize, fromDate, toDate, name, recruitmentNewsId, userHiring, gender, status} = req.body;

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
        if(name) listCondition.name =  new RegExp(name);
        if(comId) listCondition.comId =  Number(comId);
        if(recruitmentNewsId) listCondition.recruitmentNewsId =  Number(recruitmentNewsId);
        if(userHiring) listCondition.userHiring =  Number(userHiring);
        if(gender) listCondition.gender =  Number(gender);
        if(status) listCondition.status =  Number(status);
        if(fromDate) listCondition.timeSendCv = {$gte: fromDate};
        if(toDate) listCondition.timeSendCv = {$lte: toDate};

        const listCandidate = await functions.pageFind(Candidate, listCondition, { _id: 1 }, skip, limit);
        const totalCount = await functions.findCount(Candidate, listCondition);
        return functions.success(res, "Get list candidate success", {totalCount: totalCount, data: listCandidate });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.getTotalCandidateFollowDayMonth = async(req, res, next) => {
    try {
        // Get Today Start Date and End Date
        let startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        let endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        console.log(startOfDay, endOfDay);
        
        // dua dieu kien vao ob listCondition
        // {createdAt: {$gte: startOfDay, $lte: endOfDay}}
        const totalCandidateDay = await Candidate.countDocuments({comId: req.comId});
        // const totalCandidateWeek = await Candidate.find(listCondtion);
        // const totalCandidateMonth = await Candidate.find(listCondtion);
        return functions.success(res, "Get list candidate success", {data: {totalCandidateDay} });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

exports.checkDataCandidate = async(req, res, next) => {
    try {
        let {
                name, email, phone, cvFrom, userRecommend, recruitmentNewsId, timeSendCv,  interviewTime, interviewResult, interviewVote, salaryAgree, status, cv, 
                createdAt, updatedAt, isDelete, comId, isOfferJob, gender, birthday, education, exp, isMarried, address, userHiring, starVote, school, hometown, isSwitch, epIdCrm
            } = req.body;
        let fields = [
                name, email, phone, cvFrom, userRecommend, recruitmentNewsId,
                timeSendCv, gender, birthday, education, exp, isMarried, address, userHiring, starVote, hometown
                ];
        for(let i=0; i<fields.length; i++){
            if(!fields[i])
                return functions.setError(res, `Missing input value ${i+1}`, 404);
        }
        // them cac truong muon them hoac sua
        req.info = {
            name: name,
            email: email,
            phone: phone,
            gender: gender,
            birthday: birthday,
            hometown: hometown,
            education: education,
            school: school,
            exp: exp,
            isMarried: isMarried,
            address: address,
            cvFrom: cvFrom,
            userHiring: userHiring,         
            userRecommend: userRecommend,
            recruitmentNewsId: recruitmentNewsId,
            timeSendCv: timeSendCv,
            starVote: starVote,
            cv: cv
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createCandidate = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;

        //them cac truong an
        fields.comId = req.comId;

        //lay id max
        const maxIdCandi = await Candidate.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdCandi;
        if (maxIdCandi) {
            newIdCandi = Number(maxIdCandi.id) + 1;
        } else newIdCandi = 1;
        fields.id = newIdCandi;

        //tao 
        let candidate = new Candidate(fields);
        await candidate.save();
        return functions.success(res, 'Create candidate success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}


exports.updateCandidate = async(req, res, next) => {
    try{
        let candidateId = req.body.candidateId;
        if(!candidateId)
            return functions.setError(res, "Missing input id candidate!", 404);
        let fields = req.info;
        fields.updatedAt = Date.now();
        let candi = await Candidate.findOneAndUpdate({id: candidateId}, fields);
        if(!candi) {
            return functions.setError(res, "Candidate not found!", 505);
        }
        return functions.success(res, "Update info candidate success!");
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.softDeleteCandidate = async(req, res, next) =>{
    try{
        let candidateId = req.query.candidateId;
        if(!candidateId) {
            return functions.setError(res, "Missing input id", 404);
        }
        let candi = await Candidate.findOneAndUpdate({id: candidateId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!candi) {
            return functions.setError(res, "Candidate not found!", 505);
        }
        return functions.success(res, "Soft delete candidate success!");
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

//------------them cac giai doan tuyen dung 

//lay ra danh sach
exports.getListProcessInterview= async(req, res, next) => {
    try {
        //id company lay ra sau khi dang nhap
        let comId = req.comId;
        let listProcess = await ProcessInterview.find({comId: comId});
        return functions.success(res, "Get list process interview success", {data: listProcess });
    } catch (e) {
        console.log("Err from server", e);
        return functions.setError(res, "Err from server", 500);
    }
}

//get and check data for add, edit
exports.checkDataProcess = async(req, res, next) => {
    try {
        let {name, processBefore} = req.body;
        if(!name || !processBefore){
            return functions.setError(res, `Missing input value`, 404);
        }
        // them cac truong muon them hoac sua
        req.info = {
            name: name,
            processBefore: processBefore
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createProcessInterview = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;

        //them cac truong an
        fields.comId = req.comId;

        //lay id max
        const maxIdProcessInter = await ProcessInterview.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdProcessInter;
        if (maxIdProcessInter) {
            newIdProcessInter = Number(maxIdProcessInter.id) + 1;
        } else newIdProcessInter = 1;
        fields.id = newIdProcessInter;
        
        //tao 
        let processInterview = new ProcessInterview(fields);
        processInterview =  await processInterview.save();
        return functions.success(res, 'Create process interview success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.updateProcessInterview = async(req, res, next) => {
    try{
        let processInterviewId = req.body.processInterviewId;
        if(!processInterviewId)
            return functions.setError(res, "Missing input id processInterview!", 404);
        let fields = req.info;

        let processInter = await ProcessInterview.findOneAndUpdate({id: processInterviewId}, fields);
        if(!processInter) {
            return functions.setError(res, "Process Interview not found!", 505);
        }
        return functions.success(res, "Update info Process Interview success!");
    }catch(err){
        console.log("Err from server!", err);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.deleteProcessInterview = async(req, res, next) => {
    try {
        let processInterId = req.body.processInterId;
        if(!processInterId){
            return functions.success(res, "Missing input value id", 404);
        }
        processInterId = Number(processInterId);
        let processInter = await functions.getDataDeleteOne(ProcessInterview ,{id: processInterId});
        if (processInter.deletedCount===1) {
            return functions.success(res, `Delete process interview with _id=${processInterId} success`);
        }
        return functions.success(res, "Process Interview not found");
    } catch (e) {
        console.log("Error from server", e);
        return functions.setError(res, "Error from server", 500);
    }
}

//------------------------chuyen trang thai ho so ung vien

//kiem tra du lieu
exports.checkDataJob = async(req, res, next) => {
    try {
        let {canId, resiredSalary, salary, offerTime, epOffer, note, type, email, contentsend, empInterview, interviewTime} = req.body;
        if(!canId){
            return functions.setError(res, `Missing input value`, 404);
        }
        // them cac truong muon them hoac sua
        req.info = {
            canId: canId,
            resiredSalary: resiredSalary,
            salary: salary,
            offerTime: offerTime,
            epOffer: epOffer,
            note: note,
            type: type,
            email: email,
            contentsend: contentsend,
            interviewTime: interviewTime,
            empInterview: empInterview,
        }
        return next();
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

// ky hop dong
exports.createContactJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;
        
        if(!fields.resiredSalary || !fields.salary || !fields.offerTime || !fields.epOffer) {
            return functions.setError(res, `Missing input value`, 405);
        }
        //lay id max
        const maxIdContacJob = await ContactJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdContacJob;
        if (maxIdContacJob) {
            newIdContacJob = Number(maxIdContacJob.id) + 1;
        } else newIdContacJob = 1;
        fields.id = newIdContacJob;
        
        //tao 
        let contactJob = new ContactJob(fields);
        contactJob =  await contactJob.save();
        return functions.success(res, 'Create contactJob success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createCancelJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;
        
        if(!fields.type) {
            return functions.setError(res, `Missing input value`, 405);
        }
        //lay id max
        const maxIdCancelJob = await CancelJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdCancelJob;
        if (maxIdCancelJob) {
            newIdCancelJob = Number(maxIdCancelJob.id) + 1;
        } else newIdCancelJob = 1;
        fields.id = newIdCancelJob;
        
        //tao 
        let cancelJob = new CancelJob(fields);
        cancelJob =  await cancelJob.save();
        return functions.success(res, 'Create cancelJob success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createFailJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;
        
        if(!fields.type || !fields.contentsend || !fields.email) {
            return functions.setError(res, `Missing input value`, 405);
        }
        //lay id max
        const maxIdFailJob = await FailJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdFailJob;
        if (maxIdFailJob) {
            newIdFailJob = Number(maxIdFailJob.id) + 1;
        } else newIdFailJob = 1;
        fields.id = newIdFailJob;
        fields.contentsend = Buffer.from(fields.contentsend, 'base64');
        
        //tao 
        let failJob = new FailJob(fields);
        failJob =  await failJob.save();
        return functions.success(res, 'Create failJob success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}

exports.createScheduleInterview = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;
        
        if(!fields.interviewTime || !fields.empInterview || !fields.contentsend || !fields.email) {
            return functions.setError(res, `Missing input value`, 405);
        }
        //lay id max
        const maxIdScheduleInterview = await ScheduleInterview.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdScheduleInterview;
        if (maxIdScheduleInterview) {
            newIdScheduleInterview = Number(maxIdScheduleInterview.id) + 1;
        } else newIdScheduleInterview = 1;
        fields.id = newIdScheduleInterview;
        fields.content = Buffer.from(fields.contentsend, 'base64');
        
        //tao 
        let scheduleInterview = new ScheduleInterview(fields);
        scheduleInterview =  await scheduleInterview.save();
        return functions.success(res, 'Create scheduleInterview success!');
    } catch (e) {
        console.log("Err from server!", e);
        return functions.setError(res, "Err from server!", 500);
    }
}
