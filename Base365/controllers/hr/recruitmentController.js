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
const GetJob = require('../../models/hr/GetJob');
const Remind = require('../../models/hr/Remind');
const Notify = require('../../models/hr/Notify');
const AnotherSkill = require('../../models/hr/AnotherSkill');
const Category = require('../../models/hr/Categorys');
const Users = require('../../models/Users');
const folderCv = 'cv';

//lay ra danh sach nganh nghe
exports.getListCategory = async(req, res, next) => {
    try{
        let listCategory = await Category.find({}, {id: 1, name: 1, title: 1});
        return functions.success(res, "Get list recruitment success", {data: listCategory });
    }catch(e) {
        return functions.setError(res, e.message);
    }
}

// lay ra danh sach tat ca cac quy trinh tuyen dung cua cty
exports.getListRecruitment= async(req, res, next) => {
    try {
        let {page, pageSize, name, recruitmentId} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let infoLogin = req.infoLogin;
        let listCondition = {comId: infoLogin.comId, isDelete: 0};
        
        // dua dieu kien vao ob listCondition
        if(name) listCondition.name =  new RegExp(name, 'i');
        if(recruitmentId) listCondition.id = Number(recruitmentId);
        const listRecruit = await functions.pageFind(Recruitment, listCondition, { _id: -1 }, skip, limit); 
        const totalCount = await functions.findCount(Recruitment, listCondition);
        return functions.success(res, "Get list recruitment success", {totalCount: totalCount, data: listRecruit });
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.createRecruitment = async(req, res, next) => {
    try {
        
        let {nameProcess, applyFor, listStage} = req.body;
        if(!nameProcess || !applyFor || !listStage) {
            return functions.setError(res, "Missing input value!", 404);
        }
        let infoLogin = req.infoLogin;

        //tao slug
        let slug = hrService.titleToSlug(nameProcess);

        //lay id max
        const maxIdRecruit = await Recruitment.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdRecruit;
        if (maxIdRecruit) {
            newIdRecruit = Number(maxIdRecruit.id) + 1;
        } else newIdRecruit = 1;

        //tao quy trinh
        let isCom = 0;
        let createBy = infoLogin.name;
        if(infoLogin.type==1) {
            isCom=1;
            createBy = 'Công ty';
        }
        let recruitment = new Recruitment({
            id: newIdRecruit,
            name: nameProcess,
            createdBy: createBy,
            createdAt: Date.now(),
            applyFor: applyFor,
            slug: slug,
            comId: infoLogin.comId,
            isCom: isCom
        });
        recruitment = await recruitment.save();
        if(!recruitment) {
            return functions.setError(res, "Create recruitment fail!", 504);
        }

        //tao cac giai doan cua quy trinh do
        for(let i=0; i<listStage.length; i++){
            if(!listStage[i].nameStage || !listStage[i].posAssum || !listStage[i].target) {
                return functions.setError(res, "Missing input value!", 405);
            }
            //lay id max
            const maxIdStageRecruit = await StageRecruitment.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            let newIdStageRecruit;
            if (maxIdStageRecruit) {
                newIdStageRecruit = Number(maxIdStageRecruit.id) + 1;
            } else newIdStageRecruit = 1;
            let stageRecruit = new StageRecruitment({
                id: newIdStageRecruit,
                recruitmentId: recruitment.id,
                name: listStage[i].nameStage,
                positionAssumed: listStage[i].posAssum,
                target: listStage[i].target,
                completeTime: listStage[i].time,
                description: listStage[i].des
            });
            let stageRecruitment = await StageRecruitment.create(stageRecruit);
            if(!stageRecruitment) {
            return functions.setError(res, `Create stage recruitment ${i+1} fail!`, 505);
        }
        }
        
        return functions.success(res, 'Create recruitment success!');
    } catch (e) {
        return functions.setError(res, e.message);
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
        return functions.setError(res, err.message);
    }
}

exports.softDeleteRecruitment = async(req, res, next) => {
    try {
        let recruitmentId = req.body.recruitmentId;
        let recruitment = await Recruitment.findOneAndUpdate({id: recruitmentId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!recruitment) {
            return functions.setError(res, "News not found!", 505);
        }
        return functions.success(res, "Soft delete stage recruitment success!");
    } catch (e) {
        return functions.setError(res, e.message);
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
        return functions.setError(res, e.message);
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
            let listStage = await StageRecruitment.find({recruitmentId: recruitmentId, isDelete: 0});
            data.listStage = listStage;
        }
        else {
            return functions.setError(res, "Missing input value!", 404);
        }
        return functions.success(res, "get stage recruitment success!", {data: data});
    }catch(e){
        return functions.setError(res, e.message);
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
            description: des
        });
        await StageRecruitment.create(stageRecruit);
        return functions.success(res, 'Create stage recruitment success!');
    } catch (e) {
        return functions.setError(res, e.message);
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
            description: des,
        })
        if(!stageRecruit) {
            return functions.setError(res, "Stage recruitment not found!", 505);
        }
        return functions.success(res, "update state recruitment success!");
    } catch (e) {
        return functions.setError(res, e.message);
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
        return functions.setError(res, e.message);
    }
}


//------------------------------controller recruitment new----------------------

exports.getListRecruitmentNews= async(req, res, next) => {
    try {
        let {page, pageSize, title, fromDate, toDate, id} = req.body;

        //id company lay ra sau khi dang nhap
        let comId = req.infoLogin.comId;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {isDelete: 0, comId: comId};
        // dua dieu kien vao ob listCondition
        if(id) listCondition.id = Number(id);
        if(title) listCondition.title =  new RegExp(title, 'i');
        if(fromDate) listCondition.timeStart = {$gte: new Date(fromDate)};
        if(toDate) listCondition.timeEnd = {$lte: new Date(toDate)};
    
        let listRecruitmentNews = await RecruitmentNews.aggregate([
            {$match: listCondition},
            {$sort: {id: -1}},
            {$skip: skip},
            {$limit: limit},
            {
                $lookup: {
                    from: "Users",
                    localField: "hrName",
                    foreignField: "idQLC",
                    pipeline: [
                        { $match: { type: {$ne: 1} } },
                    ],
                    as: "nameHR"
                }
            },
            {
                $project: {
                    "id": "$id",
                    "title": "$title",
                    "posApply": "$posApply",
                    "cityId": "$cityId",
                    "address": "$address",
                    "cateId": "$cateId",
                    "salaryId": "$salaryId",
                    "number": "$number",
                    "timeStart": "$timeStart",
                    "timeEnd": "$timeEnd",
                    "jobDetail": "$jobDetail",
                    "wokingForm": "$wokingForm",
                    "probationaryTime": "$probationaryTime",
                    "moneyTip": "$moneyTip",
                    "recruitmentId": "$recruitmentId",
                    "jobDes": "$jobDes",
                    "interest": "$interest",
                    "jobExp": "$jobExp",
                    "hrName": "$hrName",
                    "degree": "$degree",
                    "gender": "$gender",
                    "createdAt": "$createdAt",
                    "createdBy": "$createdBy",
                    "jobRequire": "$jobRequire",
                    "isDelete": "$isDelete",
                    "comId": "$comId",
                    "memberFollow": "$memberFollow",
                    "isSample": "$isSample",
                    "isCom": "$isCom",
                    "nameHR": "$nameHR.userName",
                }
            }
        ]);
        const totalCount = await functions.findCount(RecruitmentNews, listCondition);
        return functions.success(res, "Get list recruitment news success", {totalCount: totalCount, data: listRecruitmentNews });
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

let getTotal = async(model, condition)=>{
    try{
        let total = await Candidate.aggregate([
            {$match: condition},
            {
                $lookup: {
                    from: `${model}`,
                    localField: "id",
                    foreignField: "canId",
                    as: "documents"
                }
            },
            {
                $unwind: "$documents"
            },
            {
                $count: "count"
            }
        ]);
        return total.length!=0 ? total[0].count: 0;
    }catch(err){
        console.log(err.message);
    }
}
exports.listNewActive = async(req, res)=>{
    try{
        let {page, pageSize} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 3;
        const skip = (page-1)*pageSize;
        let comId = req.infoLogin.comId;
        let condition = {comId: comId, isDelete: 0};
        let fields = {id: 1, title: 1, number: 1,timeStart: 1, timeEnd: 1, createdBy: 1, hrName: 1, address: 1, recruitmentId: 1};
        let countAllActiveNew = await functions.findCount(RecruitmentNews, condition);
        let recruitmentNew = await functions.pageFind(RecruitmentNews, condition, {id: -1}, skip, pageSize);

        //thong ke
        for(let i=0; i<recruitmentNew.length; i++) {
            let condition2 = {comId: comId, isDelete: 0, recruitmentNewsId: recruitmentNew[i].id};
            let news = recruitmentNew[i];
            let sohoso = await functions.findCount(Candidate, condition2);
            let henphongvan = await  getTotal("HR_ScheduleInterviews", condition2);
            let truotphongvan = await getTotal("HR_FailJobs", condition2);
            let quaphongvan = await getTotal("HR_GetJobs", condition2);

            news.sohoso = sohoso;
            news.henphongvan = henphongvan;
            news.truotphongvan = truotphongvan;
            news.quaphongvan = quaphongvan;

            recruitmentNew[i] = news;
        }
        return functions.success(res, "Get listNewActive success!", {countAllActiveNew, recruitmentNew});
    }catch(err) {
        return functions.setError(res, err.message);
    }
}

exports.getTotalCandidateFollowDayMonth = async(req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        // Số lượng tài liệu theo ngày hôm nay
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        let totalCandidateDay = await Candidate.countDocuments({comId: comId, isDelete: 0, timeSendCv: {$gte: today, $lt: tomorrow}});


        // Số lượng tài liệu theo tuần này
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7);

        let totalCandidateWeek = await Candidate.countDocuments({comId: comId, isDelete: 0, timeSendCv: {$gte: startOfWeek, $lt: endOfWeek}});

        // Số lượng tài liệu theo tháng này
        const startOfMonth = new Date();
        startOfMonth.setHours(0, 0, 0, 0);
        startOfMonth.setDate(1);

        const endOfMonth = new Date(startOfMonth);
        endOfMonth.setMonth(endOfMonth.getMonth() + 1);

        let totalCandidateMonth = await Candidate.countDocuments({comId: comId, isDelete: 0, timeSendCv: {$gte: startOfMonth, $lt: endOfMonth}});
        
        return functions.success(res, "Get list candidate success",{totalCandidateDay, totalCandidateWeek, totalCandidateMonth} );
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.listSchedule = async(req, res, next) => {
    try{
        let {page, pageSize} = req.body;
        if(!page) page = 1;
        if(!pageSize) pageSize = 3;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page-1)*pageSize;
        let comId = req.infoLogin.comId;
        let totalSchedule = await Candidate.aggregate([
                {$match: {comId: comId, isDelete: 0}},
                {
                    $lookup: {
                        from: "HR_ScheduleInterviews",
                        localField: "id",
                        foreignField: "canId",
                        as: "Interview"
                    }
                },
                {$match: {"Interview.isSwitch": 0}},
                {
                    $count: "totalDocuments"
                }
            ]);
        totalSchedule = totalSchedule.length>0? totalSchedule[0].totalDocuments: 0;

        let listSchedule = await Candidate.aggregate([
                {$match: {comId: comId, isDelete: 0}},
                {
                    $lookup: {
                        from: "HR_ScheduleInterviews",
                        localField: "id",
                        foreignField: "canId",
                        as: "Interview"
                    }
                },
                { $unwind: { path: "$Interview", preserveNullAndEmptyArrays: true } },
                {$match: {"Interview.isSwitch": 0}},
                {
                    $lookup: {
                        from: "HR_RecruitmentNews",
                        localField: "recruitmentNewsId",
                        foreignField: "id",
                        as: "RecruitmentNews"
                    }
                },
                { $unwind: { path: "$RecruitmentNews", preserveNullAndEmptyArrays: true } },
                {$skip: skip},
                {$limit: pageSize}
            ]);
        return functions.success(res, "Get listSchedule success", {totalSchedule, listSchedule})
    }catch(error) {
        return functions.setError(res, error.message);
    }
}

let getListInterview = async(type, recruitmentNewsId, )=> {
    try{
        let listInterview = await Candidate.aggregate([
            {$match: {recruitmentNewsId: recruitmentNewsId,isDelete: 0}},
            {
                $lookup: {
                    from: "HR_ScheduleInterviews",
                    localField: "id",
                    foreignField: "canId",
                    as: "listInterview"
                }
            },
            {
                $unwind: "$listInterview"
            },
            {
                $replaceRoot: {
                    newRoot: { $mergeObjects: ["$$ROOT", "$listInterview"]}   
                }
            },
            {$match: {result: type}},
            // {$project: {id: 1, name: 1, phone:1, email: 1}},
            {$sort: {id: 1}}
        ]);
        return listInterview;
    }catch(err){
        console.log(err.message);
    }
}

exports.getDetailRecruitmentNews= async(req, res, next) => {
    try {
        let {recruitmentNewsId} = req.body;
        if(!recruitmentNewsId){
            return functions.setError(res, "Missing input recruitmentNewsId!", 405);
        }

        //id company lay ra sau khi dang nhap
        let comId = req.infoLogin.comId;
        
        let condition = {isDelete: 0, comId: comId, id: recruitmentNewsId};
        
        var recruitmentNews = await RecruitmentNews.findOne(condition).lean();
        if(!recruitmentNews) {
            return functions.setError(res, "Khong ton tai tin tuyen dung!", 406);
        }
        let hr = await Users.findOne({idQLC: recruitmentNews.hrName});
        if(hr){
            recruitmentNews.hrName = hr.userName;
        }

        let listCandidate = await Candidate.find({recruitmentNewsId: recruitmentNewsId, isDelete: 0}, {id: 1, name: 1, phone:1, email: 1}).sort({id: 1});

        let listOfferJob = await Candidate.find({recruitmentNewsId: recruitmentNewsId, isOfferJob: 1, isDelete: 0}, {id: 1, name: 1, phone:1, email: 1}).sort({id: 1});

        let listInterview = await getListInterview(recruitmentNewsId, 1);

        let listInterviewPass = await getListInterview(recruitmentNewsId, 2);

        let listInterviewFail = await getListInterview(recruitmentNewsId, 3);
        return functions.success(res, "Get list recruitment news success", {recruitmentNews, listCandidate, listOfferJob,listInterview, listInterviewPass, listInterviewFail});
    } catch (e) {
        return functions.setError(res, e.message);
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
        return functions.setError(res, e.massage);
    }
}

exports.createRecruitmentNews = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;
        let infoLogin = req.infoLogin;
        //them cac truong an
        fields.createdAt = Date.now();
        fields.comId = infoLogin.comId;
        fields.createdBy = infoLogin.name;
        fields.isCom = 0;
        if(infoLogin.type==1){
            fields.createdBy = 'Công ty';
            fields.isCom = 1;
        }

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
        return functions.setError(res, e.message);
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
        return functions.setError(res, err.message);
    }
}

exports.softDeleteRecuitmentNews = async(req, res, next) =>{
    try{
        let newsId = req.body.newsId;
        let recruitmentNews = await RecruitmentNews.findOneAndUpdate({id: newsId}, {
            deletedAt: Date.now(),
            isDelete: 1
        })
        if(!recruitmentNews) {
            return functions.setError(res, "News not found!", 505);
        }
        return functions.success(res, "Soft delete news success!");
    }catch(err){
        return functions.setError(res, err.message);
    }
}

exports.createSampleNews = async(req, res, next) =>{
    try{
        let comId = req.infoLogin.comId;
        let newsId = req.body.newsId;
        let resetSample = await RecruitmentNews.updateMany({comId: comId}, {isSample: 0});
        if(!resetSample) {
            return functions.setError(res, "Reset sample fail!", 504);
        }
        let recruitmentNews = await RecruitmentNews.findOneAndUpdate({id: newsId, comId: comId}, {
            isSample: 1
        })
        if(!recruitmentNews) {
            return functions.setError(res, "News not found!", 505);
        }
        return functions.success(res, "Create sample news success!");
    }catch(err){
        return functions.setError(res, err.message);
    }
}

//---------------------------------ung vien
exports.getListCandidate= async(req, res, next) => {
    try {
        let {page, pageSize, fromDate, toDate, name, recruitmentNewsId, userHiring, gender, status, canId} = req.body;

        //id company lay ra sau khi dang nhap
        let comId = req.infoLogin.comId;
        if(!page) page = 1;
        if(!pageSize) pageSize = 10;
        page = Number(page);
        pageSize = Number(pageSize);
        const skip = (page - 1) * pageSize;
        const limit = pageSize;
        let listCondition = {isDelete: 0, comId: comId};
        if(canId) listCondition.id = Number(canId);
        if(name) listCondition.name =  new RegExp(name, 'i');
        if(recruitmentNewsId) listCondition.recruitmentNewsId =  Number(recruitmentNewsId);
        if(userHiring) listCondition.userHiring =  Number(userHiring);
        if(gender) listCondition.gender =  Number(gender);
        if(status) listCondition.status =  Number(status);
        if(fromDate && !toDate) listCondition.timeSendCv = {$gte: new Date(fromDate)};
        if(toDate && !fromDate) listCondition.timeSendCv = {$lte: new Date(toDate)};
        if(fromDate && toDate) listCondition.timeSendCv = {$gte: new Date(fromDate), $lte: new Date(toDate)};

        const listCandidate = await Candidate.aggregate([
            {$match: listCondition},
            {$sort: {id: -1}},
            {$skip: skip},
            {$limit: limit},
            {
                $lookup: {
                    from: "HR_AnotherSkills",
                    localField: "id",
                    foreignField: "canId",
                    as: "listSkill"
                }
            },
            //lay ra thong tin skill
            {
                $lookup: {
                    from: "HR_RecruitmentNews",
                    localField: "recruitmentNewsId",
                    foreignField: "id",
                    as: "Recruitment"
                }
            },
            { $unwind: { path: "$Recruitment", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "Users",
                    localField: "userHiring",
                    foreignField: "idQLC",
                    pipeline: [
                        { $match: { type: {$ne: 1} } },
                    ],
                    as: "NvTuyenDung"
                }
            },
            { $unwind: { path: "$NvTuyenDung", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "Users",
                    localField: "userRecommend",
                    foreignField: "idQLC",
                    pipeline: [
                        { $match: { type: {$ne: 1} } },
                    ],
                    as: "NguoiGioiThieu"
                }
            },
            { $unwind: { path: "$NguoiGioiThieu", preserveNullAndEmptyArrays: true } },

            {
                $project: {
                    'id': '$id',
                    'name': '$name',
                    'email': '$email',
                    'phone': '$phone',
                    'cvFrom': '$cvFrom',
                    'userRecommend': '$userRecommend',
                    'recruitmentNewsId': '$recruitmentNewsId',
                    'interviewTime': '$interviewTime',
                    'interviewResult': '$interviewResult',
                    'interviewVote': '$interviewVote',
                    'salaryAgree': '$salaryAgree',
                    'status': '$status',
                    'cv': '$cv',
                    'createdAt': '$createdAt',
                    'updatedAt': '$updatedAt',
                    'isDelete': '$isDelete',
                    'comId': '$comId',
                    'isOfferJob': '$isOfferJob',
                    'gender': '$gender',
                    'birthday': '$birthday',
                    'education': '$education',
                    'exp': '$exp',
                    'isMarried': '$isMarried',
                    'address': '$address',
                    'userHiring': '$userHiring',
                    'starVote': '$starVote',
                    'school': '$school',
                    'hometown': '$hometown',
                    'isSwitch': '$isSwitch',
                    'epIdCrm': '$epIdCrm',
                    'timeSendCv': '$timeSendCv',
                    'Title': '$Recruitment.title',
                    'Position': '$Recruitment.posApply',
                    'RecruitmentId': '$Recruitment.recruitmentId',
                    'NvTuyenDung': '$NvTuyenDung.userName',
                    'NguoiGioiThieu': '$NguoiGioiThieu.userName',
                    'listSkill': '$listSkill',
                }
            }
        ]);
        for(let i=0; i<listCandidate.length; i++) {
            let candidate = listCandidate[i];
            if(candidate.cv) {
                listCandidate[i].linkFileCv = hrService.createLinkFile(folderCv, candidate.cv);
            }
            listCandidate[i].positionName = hrService.positionNames[listCandidate[i].Position];
        }
        const totalCount = await functions.findCount(Candidate, listCondition);
        return functions.success(res, "Get list candidate success", {totalCount: totalCount, data: listCandidate });
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

exports.checkDataCandidate = async(req, res, next) => {
    try {
        let {
                name, email, phone, cvFrom, userRecommend, recruitmentNewsId, timeSendCv,  interviewTime, interviewResult, interviewVote, salaryAgree, status, cv, 
                createdAt, updatedAt, isDelete, comId, isOfferJob, gender, birthday, education, exp, isMarried, address, userHiring, starVote, school, hometown, isSwitch, epIdCrm,firstStarVote,listSkill,
            } = req.body;
        let fields = [
                name, email, phone, cvFrom, userRecommend, recruitmentNewsId,
                timeSendCv, gender, birthday, education, exp, isMarried, address, userHiring, firstStarVote, hometown
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
            timeSendCv: Date(timeSendCv),
            starVote: firstStarVote,
        }
        
        return next();
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.createCandidate = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;
        let infoLogin = req.infoLogin;
        //them cac truong an
        fields.comId = infoLogin.comId;

        //lay id max
        const maxIdCandi = await Candidate.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdCandi;
        if (maxIdCandi) {
            newIdCandi = Number(maxIdCandi.id) + 1;
        } else newIdCandi = 1;
        fields.id = newIdCandi;

        // luu cv
        if(req.files) {
            let cv = req.files.cv;
            if(cv && await hrService.checkFile(cv.path)){
                let nameCv = await hrService.uploadFileNameRandom(folderCv,cv);
                fields.cv = nameCv;
            }
        }

        // tao
        let candidate = new Candidate(fields);
        let newcandidate = await candidate.save();
        if(!candidate){
            return functions.setError(res, "Create candidate fail!", 506);
        }

        //them ky nang moi
        
        let listSkill = JSON.parse(req.body.listSkill);
        let listSkillInsert = [];
        if(listSkill){
            for(let i=0; i<listSkill.length; i++){
                const obj = listSkill[i];
                let dataSkill = {
                    canId: newIdCandi,
                    skillName: obj.skillName,
                    skillVote: obj.skillVote
                }
                const maxIdSkill = await AnotherSkill.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                let newIdSkill;
                if (maxIdSkill) {
                    newIdSkill = Number(maxIdSkill.id) + 1;
                } else newIdSkill = 1;
                dataSkill.id = newIdSkill;
                let skill = new AnotherSkill(dataSkill);
                let newskill = await skill.save();
                listSkillInsert.push(skill);
                if(!skill){
                    return functions.setError(res, "Create skill fail!", 506);
                }
            }
        }
        

        //them thong baos
        let listNotify = []
        let dataNotify = null;
        if(infoLogin.type==1){
            if(candidate.userHiring) {
                dataNotify = {
                    canId: newIdCandi,
                    type: 2,
                    comNotify: 1,
                    comId: infoLogin.comId,
                    userId: candidate.userHiring,
                }
            }
        }else {
            dataNotify = {
                canId: newIdCandi,
                type: 1,
                comNotify: 0,
                comId: infoLogin.comId,
                userId: infoLogin.id,
            }
        }
        if(dataNotify!=null){
            const maxIdNotify = await Notify.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            let newIdNotify;
            if (maxIdNotify) {
                newIdNotify = Number(maxIdNotify.id) + 1;
            } else newIdNotify = 1;
            dataNotify.id = newIdNotify;
            let notify = new Notify(dataNotify);
            let newnotify = await notify.save();
            listNotify.push(notify);
            if(!notify){
                return functions.setError(res, "Create notify fail!", 506);
            }
        }
        return functions.success(res, 'Create candidate success!',
            {candidate:candidate,listSkillInsert:listSkillInsert,listNotify:listNotify});
    } catch (e) {
        return functions.setError(res, e.message);
    }
}


exports.updateCandidate = async(req, res, next) => {
    try{
        let candidateId = req.body.candidateId;
        if(!candidateId)
            return functions.setError(res, "Missing input id candidate!", 404);
        let fields = req.info;
        fields.updatedAt = Date.now();
        let cv = req.files.cv;
        if(cv && await hrService.checkFile(cv.path)){
            let nameCv = await hrService.uploadFileCv(candidateId,cv);
            // await hrService.deleteFileCv(candidateId);
            fields.cv = nameCv;
        }
        //
        let candi = await Candidate.findOneAndUpdate({id: candidateId}, fields, {new: true});
        if(!candi) {
            return functions.setError(res, "Candidate not found!", 505);
        }

        //them ky nang moi
        await AnotherSkill.deleteMany({canId: candidateId});

        let listSkill = req.body.listSkill;
        if(listSkill) {
            for(let i=0; i<listSkill.length; i++){
                const obj = JSON.parse(listSkill[i]);
                let dataSkill = {
                    canId: candidateId,
                    skillName: obj.skillName,
                    skillVote: obj.skillVote
                }
                const maxIdSkill = await AnotherSkill.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                let newIdSkill;
                if (maxIdSkill) {
                    newIdSkill = Number(maxIdSkill.id) + 1;
                } else newIdSkill = 1;
                dataSkill.id = newIdSkill;
                let skill = new AnotherSkill(dataSkill);
                await skill.save();
                if(!skill){
                    return functions.setError(res, `Create skill ${i+1} fail!`, 506);
                }
            }
        }
        
        return functions.success(res, "Update info candidate success!");
    }catch(err){
        return functions.setError(res, err.message);
    }
}

exports.softDeleteCandidate = async(req, res, next) =>{
    try{
        let candidateId = req.body.candidateId;
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
        return functions.setError(res, err.message);
    }
}

//------------them cac giai doan tuyen dung 
let getCandidateProcess = async(model, condition)=> {
    return listCandidate = await model.aggregate([
        {
            $lookup: {
                from: "HR_Candidates",
                localField: "canId",
                foreignField: "id",
                as: "candidate"
            }
        },
        {$match: condition},
        {
            $lookup: {
                from: "HR_RecruitmentNews",
                localField: "candidate.recruitmentNewsId",
                foreignField: "id",
                as: "recruitmentNews"
            }
        },
        
        {$match: {"candidate.recruitmentNewsId": {$ne: 0}, "candidate.userHiring": {$ne: 0}} },
        
        {
            $lookup: {
                from: "Users",
                localField: "candidate.userHiring",
                foreignField: "idQLC",
                pipeline: [
                        { $match: { type: {$ne: 1} } },
                    ],
                as: "hrName"
            }
        },

        {$unwind: { path: "$candidate", preserveNullAndEmptyArrays: true }},
        {$unwind: { path: "$recruitmentNews", preserveNullAndEmptyArrays: true }},
        {$unwind: { path: "$hrName", preserveNullAndEmptyArrays: true }},
        {
            $project: {
                "canId": "$candidate.id",
                "canName": "$candidate.name",
                "email": "$candidate.email",
                "phone": "$candidate.phone",
                "gender": "$candidate.gender",
                "birthday": "$candidate.birthday",
                "hometown": "$candidate.hometown",
                "education": "$candidate.education",
                "school": "$candidate.school",
                "exp": "$candidate.exp",
                "isMarried": "$candidate.isMarried",
                "exp": "$candidate.exp",
                "address": "$candidate.address",
                "cvFrom": "$candidate.cvFrom",
                "userRecommend": "$candidate.userRecommend",
                "starVote": "$candidate.starVote",
                "recruitmentNewsId": "$candidate.recruitmentNewsId",
                "title": "$recruitmentNews.title",
                "userHiring": "$candidate.userHiring",
                "hrName": "$hrName.userName"
            }
        }
        ]);
}

//lay ra danh sach
//truyen canId de lay thong tin chi tiet ve ung vien
exports.getListProcessInterview= async(req, res, next) => {
    try {
        let comId = req.infoLogin.comId;
        let {fromDate, toDate, name, recruitmentNewsId, userHiring, gender, status, canId} = req.body;
        let condition = {"candidate.comId": comId, "candidate.isDelete": 0, "candidate.isSwitch": 1};
        let condition2 = {comId: comId, isDelete: 0, isSwitch: 0};
        if(fromDate && !toDate) {
            condition["candidate.timeSendCv"]= {$gte: new Date(fromDate)};
            condition2.timeSendCv= {$gte: new Date(fromDate)};
        }
        if(toDate && !fromDate) {
            condition["candidate.timeSendCv"] = {$lte: new Date(toDate)};
            condition2.timeSendCv = {$lte: new Date(toDate)};
        }
        if(toDate && fromDate) {
            condition["candidate.timeSendCv"] = {$gte: new Date(fromDate), $lte: new Date(toDate)};
            condition2.timeSendCv = {$gte: new Date(fromDate), $lte: new Date(toDate)};
        }
        if(name) {
            condition["candidate.name"] = new RegExp(name, 'i');
            condition2.name = new RegExp(name, 'i');
        }
        if(recruitmentNewsId) {
            condition["candidate.recruitmentNewsId"] = Number(recruitmentNewsId);
            condition2.recruitmentNewsId = Number(recruitmentNewsId);
        }
        if(userHiring) {
            condition["candidate.userHiring"] = Number(userHiring);
            condition2.userHiring = Number(userHiring);
        }
        if(gender) {
            condition["candidate.gender"] = Number(gender);
            condition2.gender = Number(gender);
        }
        if(status) {
            condition["candidate.status"] = Number(status);
            condition2.status = Number(status);
        }

        //truyen canId de lay thong tin chi tiet ve ung vien
        if(canId) {
            condition["candidate.id"] = Number(canId);
            condition2.id = Number(canId);
        }

        //danh sach ung vien nhan viec
        let listProcess = await ProcessInterview.find({comId: comId}).sort({processBefore: 1, id: -1}).lean();
        let listProcessInterview = [];
        let data = [];
        listProcessInterview.push({id: 0,name: "Nhận hồ sơ ứng viên",});
        listProcessInterview.push({id: 1,name: "Nhận việc",});
        listProcessInterview.push({id: 2,name: "Trượt",});
        listProcessInterview.push({id: 3,name: "Hủy",});
        listProcessInterview.push({id: 4,name: "Ký hợp đồng",});

        for(let i=0; i<listProcessInterview.length; i++) {
            data.push(listProcessInterview[i]);
            for(let j=0; j<listProcess.length; j++) {
                if(listProcessInterview[i].id == listProcess[j].beforeProcess) {
                    data.push(listProcess[j]);
                }
            }
        }
        for(let i=0; i<listProcess.length; i++) {
            let processInterview = listProcess[i];
            let listCandidate = await ScheduleInterview.aggregate([
                {$match: {processInterviewId: processInterview.id}},
                {
                    $lookup: {
                        from: "HR_Candidates",
                        localField: "canId",
                        foreignField: "id",
                        as: "candidate"
                    }
                },
                {$unwind: { path: "$candidate", preserveNullAndEmptyArrays: true }},
                {$match: condition},
                {
                    $lookup: {
                        from: "HR_RecruitmentNews",
                        localField: "candidate.recruitmentNewsId",
                        foreignField: "id",
                        as: "recruitmentNews"
                    }
                },
                {$unwind: { path: "$recruitmentNews", preserveNullAndEmptyArrays: true }},
                {
                    $lookup: {
                        from: "Users",
                        localField: "candidate.userHiring",
                        foreignField: "idQLC",
                        pipeline: [
                            { $match: { type: {$ne: 1} } },
                        ],
                        as: "hrName"
                    }
                },
                {$unwind: { path: "$hrName", preserveNullAndEmptyArrays: true }},
                {
                    $project: {
                        "id": "$id",
                        "name": "$name",
                        "processBefore": "$processBefore",
                        "canId": "$canId",
                        "canName": "$candidate.name",
                        "email": "$candidate.email",
                        "phone": "$candidate.phone",
                        "starVote": "$candidate.starVote",
                        "recruitmentNewsId": "$recruitmentNews.id",
                        "title": "$recruitmentNews.title",
                        "userHiring": "$candidate.userHiring",
                        "nameHr": "$hrName.userName",
                    }
                }
            ]);
            processInterview.totalCandidate = listCandidate.length;
            processInterview.listCandidate = listCandidate;
            listProcess[i] = processInterview;
        }
        let listCandidate = await Candidate.aggregate([
            {$match: condition2},
            {
                $lookup: {
                    from: "HR_RecruitmentNews",
                    localField: "recruitmentNewsId",
                    foreignField: "id",
                    as: "RecruitmentNew"
                }
            },

            {
                $lookup: {
                    from: "Users",
                    localField: "userHiring",
                    foreignField: "idQLC",
                    pipeline: [
                        { $match: { type: {$ne: 1} } },
                    ],
                    as: "hrName"
                }
            },
            { $unwind: { path: "$RecruitmentNew", preserveNullAndEmptyArrays: true } },
            { $unwind: { path: "$hrName", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    'id': '$id',
                    'name': '$name',
                    'email': '$email',
                    'phone': '$phone',
                    'starVote': '$starVote',
                    'recruitmentNewsId': '$recruitmentNewsId',
                    'title': '$RecruitmentNew.title',
                    'userHiring': '$userHiring',
                    'hrName': '$hrName.userName',
                }
            }
        ]);
        let listCandidateGetJob = await getCandidateProcess(GetJob, condition);
        let listCandidateCancelJob = await getCandidateProcess(CancelJob, condition);
        let listCandidateFailJob = await getCandidateProcess(FailJob, condition);
        let listCandidateContactJob = await getCandidateProcess(ContactJob, condition);

        return functions.success(res, "Get list process interview success", {data, listCandidate,listCandidateGetJob, listCandidateCancelJob, listCandidateFailJob, listCandidateContactJob});
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

//get and check data for add, edit
exports.checkDataProcess = async(req, res, next) => {
    try {
        let {name, processBefore} = req.body;
        if(!name || !processBefore){
            return functions.setError(res, `Missing input value`, 404);
        }
        let comId = req.infoLogin.comId;
        
        //lay ra giai doan dung dang truoc
        let beforeProcess = 0; //id giai doan mac dinh phia truoc 1, 2, 3, 4
        if(processBefore!=1 && processBefore!=2 && processBefore!=3 && processBefore!=4){
            let process = await ProcessInterview.findOne({id: processBefore, comId: comId});
            if(process && process.beforeProcess!=0){
                beforeProcess = process.beforeProcess;
            }
        }else beforeProcess = processBefore;
        // them cac truong muon them hoac sua
        req.info = {
            name: name,
            processBefore: processBefore,
            beforeProcess: beforeProcess,
        }
        return next();
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.createProcessInterview = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let fields = req.info;

        //them cac truong an
        fields.comId = req.infoLogin.comId;

        //lay id max
        // const maxIdProcess = await functions.getMaxIdByField(ProcessInterview, 'id');
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
        return functions.setError(res, e.message);
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
        return functions.setError(res, err.message);
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
        return functions.setError(res, e.message);
    }
}

//------------------------chuyen trang thai ho so ung vien

//kiem tra du lieu

let updateInfoCandidate = async(canId,data)=>{
    try{
        let can = await Candidate.findOneAndUpdate({id: canId}, data);
        return can;
    }catch(e){
        console.log(e);
    }
}

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
        return functions.setError(res, e.message);
    }
}

// ky hop dong
exports.createContactJob = async(req, res, next) => {
    try {
        let {canId, resiredSalary, salary, offerTime, epOffer, note} = req.body;
        if(!canId || !resiredSalary || !salary || !offerTime || !epOffer) {
            return functions.setError(res, `Missing input value`, 404);
        }
        canId = Number(canId);
        //cap nhat thong tin ung vien
        let {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote} = req.body;
        if(!name || !cvFrom || !userHiring || !recruitmentNewsId || !timeSendCv || !starVote) {
            return functions.setError(res, `Missing input value`, 405);
        }
        //lay id max
        const maxIdContacJob = await ContactJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdContacJob;
        if (maxIdContacJob) {
            newIdContacJob = Number(maxIdContacJob.id) + 1;
        } else newIdContacJob = 1;

        let infoContactJob = {id: newIdContacJob, canId, resiredSalary, salary, offerTime, epOffer, note};
        //tao 
        let contactJob = await ContactJob.findOneAndUpdate({canId: canId}, infoContactJob, {upsert: true, new: true});
        if(!contactJob){
            return functions.setError(res, "Create contactJob fail!", 505);
        }

        let infoCan = {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote, isSwitch: 1, status: 4};
        let can = await updateInfoCandidate(canId, infoCan);
        if(!can){
            functions.setError(res, `Update info candidate fail`, 506); 
        }

        //  Cập nhật giai đoạn
        await ScheduleInterview.findOneAndUpdate({canId: canId}, {isSwitch: 1});

        //xoa thang thai ung vien sau khi cap nhat
        await GetJob.deleteOne({canId: canId});
        await FailJob.deleteOne({canId: canId});
        await CancelJob.deleteOne({canId: canId});
        await ScheduleInterview.deleteOne({canId: canId});

        // cập nhật skill 
        if(req.body.listSkill){
            let listSkill = JSON.parse(req.body.listSkill);
            for(let i=0; i<listSkill.length; i++) {
                if(listSkill[i].id){
                    await AnotherSkill.updateOne({canId:canId,id:listSkill[i].id},{$set:{
                        skillName:listSkill[i].skillName,
                        skillVote:listSkill[i].skillVote
                    }});
                }
                else{
                    const obj = listSkill[i];
                    let dataSkill = {
                        canId: canId,
                        skillName: obj.skillName,
                        skillVote: obj.skillVote
                    };
                    const maxIdSkill = await AnotherSkill.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    let newIdSkill;
                    if (maxIdSkill) {
                        newIdSkill = Number(maxIdSkill.id) + 1;
                    } else newIdSkill = 1;
                    dataSkill.id = newIdSkill;
                    let skill = new AnotherSkill(dataSkill);
                    await skill.save();
                }
            };
        }
        return functions.success(res, 'Create contactJob success!');
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.createCancelJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let {canId, resiredSalary, salary, note, status} = req.body;
        if(!canId || !status) {
            return functions.setError(res, `Missing input value`, 405);
        }
        canId = Number(canId);
        //cap nhat thong tin ung vien
        let {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote} = req.body;
        if(!name || !cvFrom || !userHiring || !recruitmentNewsId || !timeSendCv || !starVote) {
            return functions.setError(res, `Missing input value`, 405);
        }
        //lay id max
        const maxIdCancelJob = await CancelJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdCancelJob;
        if (maxIdCancelJob) {
            newIdCancelJob = Number(maxIdCancelJob.id) + 1;
        } else newIdCancelJob = 1;

        let infoCancelJob = {id:newIdCancelJob,  canId, resiredSalary, salary, note, status};
        
        //tao 
        let cancelJob = await CancelJob.findOneAndUpdate({canId: canId}, infoCancelJob, {upsert: true, new: true});
        if(!cancelJob){
            return functions.setError(res, "Create cancelJob fail!", 505);
        }

        let infoCan = {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote, isSwitch: 1, status: 3};
        let can = await updateInfoCandidate(canId, infoCan);
        if(!can){
            functions.setError(res, `Update info candidate fail`, 506); 
        }

        // cập nhật skill 
        if(req.body.listSkill){
            let listSkill = JSON.parse(req.body.listSkill);
            for(let i=0; i<listSkill.length; i++) {
                if(listSkill[i].id){
                    await AnotherSkill.updateOne({canId:canId,id:listSkill[i].id},{$set:{
                        skillName:listSkill[i].skillName,
                        skillVote:listSkill[i].skillVote
                    }});
                }
                else{
                    const obj = listSkill[i];
                    let dataSkill = {
                        canId: canId,
                        skillName: obj.skillName,
                        skillVote: obj.skillVote
                    };
                    const maxIdSkill = await AnotherSkill.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    let newIdSkill;
                    if (maxIdSkill) {
                        newIdSkill = Number(maxIdSkill.id) + 1;
                    } else newIdSkill = 1;
                    dataSkill.id = newIdSkill;
                    let skill = new AnotherSkill(dataSkill);
                    await skill.save();
                }
            };
        }
        //  Cập nhật giai đoạn
        await ScheduleInterview.findOneAndUpdate({canId: canId}, {isSwitch: 1});

        //xoa thang thai ung vien sau khi cap nhat
        await GetJob.deleteOne({canId: canId});
        await FailJob.deleteOne({canId: canId});
        await ContactJob.deleteOne({canId: canId});
        await ScheduleInterview.deleteOne({canId: canId});

        return functions.success(res, 'Create cancelJob success!');
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.createFailJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let {canId, note, type, email, contentsend} = req.body;
        if(!canId || !type || !contentsend || !email) {
            return functions.setError(res, `Missing input value`, 405);
        }
        let {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote} = req.body;
        if(!name || !cvFrom || !userHiring || !recruitmentNewsId || !timeSendCv || !starVote) {
            return functions.setError(res, `Missing input value`, 405);
        }
        canId = Number(canId);

        let infoFailJob = {canId, type, email, note};
        const maxIdFailJob = await FailJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdFailJob;
        if (maxIdFailJob) {
            newIdFailJob = Number(maxIdFailJob.id) + 1;
        } else newIdFailJob = 1;
        infoFailJob.id = newIdFailJob;
        infoFailJob.contentsend = contentsend;
        
        let failJob = await FailJob.findOneAndUpdate({canId: canId}, infoFailJob, {upsert: true, new: true});
        if(!failJob){
            return functions.setError(res, "Create failJob fail!", 505);
        }
        //gui email
        await hrService.sendEmailtoCandidate(email, '[hr.timviec365.vn] Thư Trả lời kết quả phỏng vấn', infoFailJob.contentsend);

        //cap nhat thong tin ung vien
        

        //cap nhat thong tin ung vien
        let infoCan = {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote, isSwitch: 1, status: 2};
        let can = await updateInfoCandidate(canId, infoCan);
        if(!can){
            functions.setError(res, `Update info candidate fail`, 506); 
        }

         //xoa thang thai ung vien sau khi cap nhat
        await GetJob.deleteOne({canId: canId});
        await CancelJob.deleteOne({canId: canId});
        await ContactJob.deleteOne({canId: canId});
        await ScheduleInterview.deleteOne({canId: canId});

        //  Cập nhật giai đoạn
        await ScheduleInterview.findOneAndUpdate({canId: canId}, {isSwitch: 1});

        // cập nhật skill 
        if(req.body.listSkill){
            let listSkill = JSON.parse(req.body.listSkill);
            for(let i=0; i<listSkill.length; i++) {
                if(listSkill[i].id){
                    await AnotherSkill.updateOne({canId:canId,id:listSkill[i].id},{$set:{
                        skillName:listSkill[i].skillName,
                        skillVote:listSkill[i].skillVote
                    }});
                }
                else{
                    const obj = listSkill[i];
                    let dataSkill = {
                        canId: canId,
                        skillName: obj.skillName,
                        skillVote: obj.skillVote
                    };
                    const maxIdSkill = await AnotherSkill.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    let newIdSkill;
                    if (maxIdSkill) {
                        newIdSkill = Number(maxIdSkill.id) + 1;
                    } else newIdSkill = 1;
                    dataSkill.id = newIdSkill;
                    let skill = new AnotherSkill(dataSkill);
                    await skill.save();
                }
            };
        }

        return functions.success(res, 'Create failJob success!');
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.addCandidateProcessInterview = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let {canId, resiredSalary, salary, note, email, contentsend, empInterview, interviewTime, processInterviewId} = req.body;
        if(!canId || !interviewTime || !empInterview || !contentsend || !email || !processInterviewId) {
            return functions.setError(res, `Missing input value`, 405);
            
        }
        canId = Number(canId);
        let {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote} = req.body;
        if(!name || !cvFrom || !userHiring || !recruitmentNewsId || !timeSendCv || !starVote) {
            return functions.setError(res, `Missing input value`, 406);
        }
        //lay id max
        const maxIdScheduleInterview = await ScheduleInterview.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdScheduleInterview;
        if (maxIdScheduleInterview) {
            newIdScheduleInterview = Number(maxIdScheduleInterview.id) + 1;
        } else newIdScheduleInterview = 1;

        let infoInterview = {
            id:newIdScheduleInterview, 
            canId, 
            resiredSalary, 
            salary, 
            note, 
            canEmail: email,
            processInterviewId, 
            empInterview, 
            interviewTime,
            content: contentsend
        };
        //tao 
        let scheduleInterview = await ScheduleInterview.findOneAndUpdate({canId: canId}, infoInterview, {upsert: true, new: true});
        if(!scheduleInterview){
            functions.setError(res, `Create getJob fail!`, 507);
        }
        //gui email
        let checkEmail = req.body.checkEmail;
        if(checkEmail>0){
            //gui email
            await hrService.sendEmailtoCandidate(email, '[hr.timviec365.vn] Thư mời phỏng vấn', infoInterview.content);
        }

        //cap nhat thong tin ung vien
        let infoCan = {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote, isSwitch: 1, status: 5};
        let can = await updateInfoCandidate(canId, infoCan);
        if(!can){
            functions.setError(res, `Update info candidate fail`, 506); 
        }
        
        //xoa thang thai ung vien sau khi cap nhat
        await FailJob.deleteOne({canId: canId});
        await CancelJob.deleteOne({canId: canId});
        await ContactJob.deleteOne({canId: canId});
        await GetJob.deleteOne({canId: canId});
        
        //nhac nho
        const maxIdRemind = await Remind.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdRemind;
        if (maxIdRemind) {
            newIdRemind = Number(maxIdRemind.id) + 1;
        } else newIdRemind = 1;

        let comId = req.infoLogin.comId;
        let infoRemind = {id: newIdRemind, type: 0, canId: canId, canName: can.name, comId: comId, userId: empInterview, time: interviewTime};
        let remind = new Remind(infoRemind);
        remind = await Remind.create(remind);

         // cập nhật skill 
        if(req.body.listSkill){
            let listSkill = JSON.parse(req.body.listSkill);
            for(let i=0; i<listSkill.length; i++) {
                if(listSkill[i].id){
                    await AnotherSkill.updateOne({canId:canId,id:listSkill[i].id},{$set:{
                        skillName:listSkill[i].skillName,
                        skillVote:listSkill[i].skillVote
                    }});
                }
                else{
                    const obj = listSkill[i];
                    let dataSkill = {
                        canId: canId,
                        skillName: obj.skillName,
                        skillVote: obj.skillVote
                    };
                    const maxIdSkill = await AnotherSkill.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    let newIdSkill;
                    if (maxIdSkill) {
                        newIdSkill = Number(maxIdSkill.id) + 1;
                    } else newIdSkill = 1;
                    dataSkill.id = newIdSkill;
                    let skill = new AnotherSkill(dataSkill);
                    await skill.save();
                }
            };
        }

        if(!remind){
            functions.setError(res, `Create remind fail`, 505);    
        }
        return functions.success(res, 'Create scheduleInterview success!');
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.addCandidateGetJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let comId = req.infoLogin.comId;
        let {canId, resiredSalary, salary, note, email, contentsend, empInterview, interviewTime} = req.body;

        if(!canId || !salary || !resiredSalary|| !interviewTime || !empInterview || !contentsend || !email) {
            return functions.setError(res, `Missing input value`, 405);
        }
        
        //lay id max
        const maxIdScheduleInterview = await GetJob.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
        let newIdScheduleInterview;
        if (maxIdScheduleInterview) {
            newIdScheduleInterview = Number(maxIdScheduleInterview.id) + 1;
        } else newIdScheduleInterview = 1;
        
        let infoGetJob = {id: newIdScheduleInterview, canId, resiredSalary, salary, note, email, contentsend, empInterview, interviewTime};
        infoGetJob.contentSend = contentsend
        
        //tao 
        let getJob = await GetJob.findOneAndUpdate({canId: canId}, infoGetJob, {upsert: true, new: true});
        if(getJob){

            //gui email
            let checkEmail = req.body.checkEmail;
            if(checkEmail>0){
                //gui email
                await hrService.sendEmailtoCandidate(email, '[hr.timviec365.vn] Thư mời nhận việc', infoGetJob.contentSend);
            }

            //
            let {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote} = req.body;
            if(!name || !cvFrom || !userHiring || !recruitmentNewsId || !timeSendCv || !starVote) {
                return functions.setError(res, `Missing input value`, 405);
            }
            //cap nhat thong tin ung vien
            let infoCan = {name, cvFrom, userHiring, timeSendCv, recruitmentNewsId, starVote, isSwitch: 1, status: 1};
            let can = await updateInfoCandidate(canId, infoCan);
            if(!can){
                functions.setError(res, `Update info candidate fail`, 506); 
            }
            
            //xoa thang thai ung vien sau khi cap nhat
            await FailJob.deleteOne({canId: canId});
            await CancelJob.deleteOne({canId: canId});
            await ContactJob.deleteOne({canId: canId});
            await ScheduleInterview.deleteOne({canId: canId});

            // console.log(a, b, c);
            //nhac nho
            const maxIdRemind = await Remind.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
            let newIdRemind;
            if (maxIdRemind) {
                newIdRemind = Number(maxIdRemind.id) + 1;
            } else newIdRemind = 1;

            let infoRemind = {id: newIdRemind, type: 1, canId: canId, canName: can.name, comId: comId, userId: empInterview, time: interviewTime};
            let remind = new Remind(infoRemind);
            remind = await Remind.create(remind);
            if(!remind){
                functions.setError(res, `Create remind fail`, 505);    
            }
        }else {
            functions.setError(res, `Create getJob fail!`, 507);
        }
        
        // cập nhật skill 
        if(req.body.listSkill){
            let listSkill = JSON.parse(req.body.listSkill);
            for(let i=0; i<listSkill.length; i++) {
                if(listSkill[i].id){
                    await AnotherSkill.updateOne({canId:canId,id:listSkill[i].id},{$set:{
                        skillName:listSkill[i].skillName,
                        skillVote:listSkill[i].skillVote
                    }});
                }
                else{
                    const obj = listSkill[i];
                    let dataSkill = {
                        canId: canId,
                        skillName: obj.skillName,
                        skillVote: obj.skillVote
                    };
                    const maxIdSkill = await AnotherSkill.findOne({}, { id: 1 }).sort({ id: -1 }).limit(1).lean();
                    let newIdSkill;
                    if (maxIdSkill) {
                        newIdSkill = Number(maxIdSkill.id) + 1;
                    } else newIdSkill = 1;
                    dataSkill.id = newIdSkill;
                    let skill = new AnotherSkill(dataSkill);
                    await skill.save();
                }
            };
        }

        return functions.success(res, 'Create getJob success!');
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.detailCandidateGetJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let comId = req.infoLogin.comId;
        let canId = req.body.canId;
        if(!canId){
            return functions.setError(res, "Missing input canId!", 405);
        }
        
        let list_process_interview = await ProcessInterview.find({comId: comId}, {id: 1, name: 1}).sort({id: -1}).lean();
        let list_new = await RecruitmentNews.find({comId: comId, isDelete: 0}).sort({id: -1}).lean();
        let detail = await Candidate.findOne({id: canId});
        let another_skill = await AnotherSkill.find({canId: canId});
        let list_schedule = await ScheduleInterview.find({canId: canId});
        let detail_get_job = await GetJob.findOne({canId: canId});
        
        return functions.success(res, 'Get detailCandidateGetJob success!', {list_process_interview, list_new, detail, another_skill, detail_get_job, list_schedule});
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

let detailGenaral = async(comId, canId) => {
    try {
        let list_process_interview = await ProcessInterview.find({comId: comId}, {id: 1, name: 1}).sort({id: 1}).lean();
        let list_new = await RecruitmentNews.find({comId: comId, isDelete: 0}).sort({id: 1}).lean();
        let detail = await Candidate.findOne({id: canId});
        let another_skill = await AnotherSkill.find({canId: canId});
        let list_schedule = await ScheduleInterview.find({canId: canId});
        
        let data = {list_process_interview, list_new, detail, another_skill, list_schedule};
        return data;
    } catch (e) {
        console.log("Err from server!", e);
    }
}

exports.detailCandidateGetJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let comId = req.infoLogin.comId;
        let canId = req.body.canId;
        if(!canId){
            return functions.setError(res, "Missing input canId!", 405);
        }
        let data = await detailGenaral(comId, canId);
        let detail_get_job = await GetJob.findOne({canId: canId});
        data.detail_get_job = detail_get_job;
        
        return functions.success(res, 'Get detailCandidateGetJob success!', data);
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.detailCandidateFailJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let comId = req.infoLogin.comId;
        let canId = req.body.canId;
        if(!canId){
            return functions.setError(res, "Missing input canId!", 405);
        }
        let data = await detailGenaral(comId, canId);
        let detail_fail_job = await FailJob.findOne({canId: canId});
        data.detail_fail_job = detail_fail_job;
        
        return functions.success(res, 'Get detailCandidateFailJob success!', data);
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.detailCandidateCancelJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let comId = req.infoLogin.comId;
        let canId = req.body.canId;
        if(!canId){
            return functions.setError(res, "Missing input canId!", 405);
        }
        let data = await detailGenaral(comId, canId);
        let detail_cancel_job = await CancelJob.findOne({canId: canId});
        data.detail_cancel_job = detail_cancel_job;
        
        return functions.success(res, 'Get detailCandidateCancelJob success!', data);
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

exports.detailCandidateContactJob = async(req, res, next) => {
    try {
        //lay thong tin tu nguoi dung nhap
        let comId = req.infoLogin.comId;
        let canId = req.body.canId;
        if(!canId){
            return functions.setError(res, "Missing input canId!", 405);
        }
        let data = await detailGenaral(comId, canId);
        let detail_contact_job = await ContactJob.findOne({canId: canId});
        data.detail_contact_job = detail_contact_job;
        
        return functions.success(res, 'Get detailCandidateContactJob success!', data);
    } catch (e) {
        return functions.setError(res, e.message);
    }
}

