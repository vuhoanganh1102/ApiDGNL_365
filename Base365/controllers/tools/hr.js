const functions = require('../../services/functions');
const Recruitment = require('../../models/hr/Recruitments.js');
const { formRadioButton } = require('pdfkit');
const HR_Cancel = require('../../models/hr/CancelJob.js');
const HR_FailJob = require('../../models/hr/FailJob.js');
const HR_ContactJob = require('../../models/hr/ContactJob.js');
const HR_Notifys = require('../../models/hr/Notify.js');
const HR_Permisions = require('../../models/hr/Permision.js');
const HR_Policys = require('../../models/hr/Policys.js');
const HR_StageRecruitments = require('../../models/hr/StageRecruitment.js');

exports.recruitment = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_recruitment?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let name = data[i].name;
            let created_by = data[i].created_by;
            let created_at = data[i].created_at;
            let deleted_at = data[i].deleted_at;
            let is_delete = data[i].is_delete;
            let apply_for = data[i].apply_for;
            let slug = data[i].slug;
            let com_id = data[i].com_id;
            let is_com = data[i].is_com;
            const check_id = await Recruitment.findById(_id);
            if (!check_id || check_id.length === 0) {
                let data_recruitment = new Recruitment({ _id, name, created_by, created_at, deleted_at, is_delete, apply_for, slug, com_id, is_com });
                await Recruitment.create(data_recruitment);
            }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.recruitment_news = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_recruitment_news?page=1');
        for (let i = 0; i < data.length; i++) {
            let id_recruitment_news = Number(data[i].id);
            let title = data[i].title;
            let position_apply = data[i].position_apply;
            let cit_id = data[i].cit_id;
            let address = data[i].address;
            let cate_id = data[i].cate_id;
            let salary_id = data[i].salary_id;
            let number = data[i].number;
            let recruitment_time = data[i].recruitment_time;
            let recruitment_time_to = data[i].recruitment_time_to;
            let job_detail = data[i].job_detail;
            let woking_form = data[i].woking_form;
            let probationary_time = data[i].probationary_time;
            let money_tip = data[i].money_tip;
            let interest = data[i].interest;
            let job_exp = data[i].job_exp;
            let degree = data[i].degree;
            let gender = data[i].gender;
            let member_follow = data[i].member_follow;
            let hr_name = data[i].hr_name;
            let created_at = data[i].created_at;
            let updated_at = data[i].updated_at;
            let deleted_at = data[i].deleted_at;
            let is_delete = data[i].is_delete;
            let com_id = data[i].com_id;
            let is_com = data[i].is_com;
            let created_by = data[i].created_by;
            let is_sample = data[i].is_sample;
            let query = await Recruitment.findById(data[i].recruitmen_id);
            if (!query) {
                continue
                // return functions.setError(res, "can't find id Recruitment");
            } else {
                let check_data = await Recruitment.find({ 'recruitment_news.id_recruitment_news': id_recruitment_news })
                if (!check_data || check_data.length === 0) {
                    query.recruitment_news
                        .push({
                            id_recruitment_news,
                            title,
                            position_apply,
                            cit_id,
                            address,
                            cate_id,
                            salary_id,
                            number,
                            recruitment_time,
                            recruitment_time_to,
                            job_detail,
                            woking_form,
                            probationary_time,
                            money_tip,
                            interest,
                            job_exp,
                            degree,
                            gender,
                            member_follow,
                            hr_name,
                            created_at,
                            updated_at,
                            deleted_at,
                            is_delete,
                            com_id,
                            is_com,
                            created_by,
                            is_sample
                        });
                    await query.save();
                }
            }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.schedule_interview = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_schedule_interview?page=1');
        for (let i = 0; i < data.length; i++) {
            let id_schedule_interview = Number(data[i].id);
            let candidate_id = data[i].candidate_id;
            let time_interview = data[i].time_interview;
            let result = data[i].result;
            let hr_name = data[i].hr_name;
            let salary = data[i].salary;
            let vote = data[i].vote;
            let communication_skill = data[i].communication_skill;
            let advanced_skill = data[i].advanced_skill;
            let foreign_language = data[i].foreign_language;
            let another_skill = data[i].another_skill;
            let another = data[i].another;
            let query = await Recruitment.findOne({ 'recruitment_news.id_recruitment_news': data[i].recruitment_news_id });
            if (query) {
                if (query.recruitment_news.length !== 0) {
                    for (let i = 0; i < query.recruitment_news.length; i++) {
                        if (query.recruitment_news[i].id_recruitment_news === Number (data[i].recruitment_news_id)) {
                            query.recruitment_news[i].schedule_interview.push({
                                id_schedule_interview,
                                candidate_id,
                                time_interview,
                                result,
                                hr_name,
                                salary,
                                vote,
                                communication_skill,
                                advanced_skill,
                                foreign_language,
                                another_skill,
                                another
                            })
                        }
                        console.log(typeof query.recruitment_news[i].id_recruitment_news);
                        console.log(typeof data[i].recruitment_news_id)
                        await query.save();
                    }
                }
            }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.stage_recruitment =  async(req, res, next) =>{
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_schedule_interview?page=1');
        for (let i = 0; i < data.length; i++) {
            let id_schedule_interview = Number(data[i].id);
            let candidate_id = data[i].candidate_id;
            let time_interview = data[i].time_interview;
            let result = data[i].result;
            let hr_name = data[i].hr_name;
            let salary = data[i].salary;
            let vote = data[i].vote;
            let communication_skill = data[i].communication_skill;
            let advanced_skill = data[i].advanced_skill;
            let foreign_language = data[i].foreign_language;
            let another_skill = data[i].another_skill;
            let another = data[i].another;
            let query = await Recruitment.findOne({ 'recruitment_news.id_recruitment_news': data[i].recruitment_news_id });
            if (query) {
                if (query.recruitment_news.length !== 0) {
                    for (let i = 0; i < query.recruitment_news.length; i++) {
                        if (query.recruitment_news[i].id_recruitment_news === Number (data[i].recruitment_news_id)) {
                            query.recruitment_news[i].schedule_interview.push({
                                id_schedule_interview,
                                candidate_id,
                                time_interview,
                                result,
                                hr_name,
                                salary,
                                vote,
                                communication_skill,
                                advanced_skill,
                                foreign_language,
                                another_skill,
                                another
                            })
                        }
                        console.log(typeof query.recruitment_news[i].id_recruitment_news);
                        console.log(typeof data[i].recruitment_news_id)
                        await query.save();
                    }
                }
            }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
// cancel job
exports.cancelJob = async (req,res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_cancel_job?page=1');
        for (let i = 0; i < data.length; i++) {
                let _id = Number(data[i].id);
                let canId = data[i].can_id;
                let isDelete = data[i].is_delete;
                let deletedAt = data[i].deleted_at;
                let resiredSalary = data[i].resired_salary;
                let salary = data[i].salary;
                let note = data[i].note;
                let status = data[i].status;
                let isSwitch = data[i].is_switch;
                let createdAt = data[i].created_at;
                // const check_id = await HR_Cancel.findById(_id);
                // if (!check_id || check_id.length === 0) {
                    let data_recruitment = new HR_Cancel({ _id, canId, isDelete, deletedAt, resiredSalary, salary, note, status, isSwitch, createdAt });
                    await HR_Cancel.create(data_recruitment);
                // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// failJob

exports.failJob = async (req,res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_failed_job?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let canId = data[i].can_id;
            let type = data[i].type;
            let isDelete = data[i].is_delete;
            let deletedAt = data[i].deleted_at;
            let note = data[i].note;
            let email = data[i].email;
            let contentsend = data[i].contentsend;
            let isSwitch = data[i].is_switch;
            let createdAt = data[i].created_at;
            // const check_id = await HR_Cancel.findById(_id);
            // if (!check_id || check_id.length === 0) {
            let data_recruitment = new HR_FailJob({ _id, canId, isDelete, deletedAt, note, email, contentsend, isSwitch, createdAt });
            await HR_FailJob.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// ContactJob

exports.contactJob = async (req,res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_contact_job?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let canId = data[i].can_id;
            let isDelete = data[i].is_delete;
            let deletedAt = data[i].deleted_at;
            let resiredSalary = data[i].resired_salary;
            let salary = data[i].salary;
            let offerTime = data[i].offer_time;
            let epOffer = data[i].ep_offer;
            let note = data[i].note;
            let isSwitch = data[i].is_switch;
            let createdAt = data[i].created_at;
            // const check_id = await HR_Cancel.findById(_id);
            // if (!check_id || check_id.length === 0) {
            let data_recruitment = new HR_ContactJob({ _id, canId, isDelete, deletedAt,resiredSalary, note, salary, offerTime, epOffer, isSwitch,createdAt });
            await HR_ContactJob.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Notify
exports.notify = async (req,res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_contact_job?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let canId = data[i].can_id;
            let type = data[i].type;
            let comNotify = data[i].com_notify;
            let comId = data[i].com_id;
            let userId = data[i].user_id;
            let createdAt = data[i].created_at;
            // const check_id = await HR_Cancel.findById(_id);
            // if (!check_id || check_id.length === 0) {
            let data_recruitment = new HR_Notifys({ _id, canId, type, comNotify,comId, userId, createdAt });
            await HR_Notifys.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// permission
exports.permission = async (req,res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_permision?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let namePer = data[i].name_per;
            // const check_id = await HR_Cancel.findById(_id);
            // if (!check_id || check_id.length === 0) {
            let data_recruitment = new HR_Permisions({ _id, namePer});
            await HR_Permisions.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// policys
exports.policy = async (req,res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_permision?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let provisionId = data[i].provision_id;
            let timeStart = data[i].time_start;
            let supervisorName = data[i].supervisor_name;
            let applyFor = data[i].apply_for;
            let content = data[i].content;
            let createdBy = data[i].created_by;
            let isDelete = data[i].is_delete;
            let createdAt = data[i].created_at;
            let name = data[i].name;
            let file = data[i].file;
            let deletedAt = data[i].deleted_at;
            // const check_id = await HR_Cancel.findById(_id);
            // if (!check_id || check_id.length === 0) {
            let data_recruitment = new HR_Policys({ _id, provisionId,timeStart,supervisorName,applyFor,content,createdBy,isDelete,createdAt, name,file,deletedAt});
            await HR_Policys.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}
//stageRecruitment
exports.stageRecruitment = async (req,res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_stage_recruitment?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let recruitmentId = data[i].recruitment_id;
            let name = data[i].name;
            let positionAssumed = data[i].position_assumed;
            let target = data[i].target;
            let complete_time = data[i].complete_time;
            let description = data[i].description;
            let isDelete = data[i].is_delete;
            // const check_id = await HR_Cancel.findById(_id);
            // if (!check_id || check_id.length === 0) {
            let data_recruitment = new HR_StageRecruitments({ _id, recruitmentId,name,positionAssumed,target,complete_time,description,isDelete});
            await HR_StageRecruitments.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}