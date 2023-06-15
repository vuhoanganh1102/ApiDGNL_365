const functions = require('../../services/functions');
//const Recruitment = require('../../models/hr/Recruitments.js');
const HR_AchievementFors = require('../../models/hr/AchievementFors');
const HR_AddInfoLeads = require('../../models/hr/AddInfoLeads');
const HR_Blogs = require('../../models/hr/Blogs');
const HR_Categorys = require('../../models/hr/Categorys');
const HR_CiSessions = require('../../models/hr/CiSessions');
const HR_Citys = require('../../models/hr/Citys');
const HR_CrontabQuitJobs = require('../../models/hr/CrontabQuitJobs');
const HR_DepartmentDetails = require('../../models/hr/DepartmentDetails');
const HR_DescPositions = require('../../models/hr/DescPositions');
const HR_Devices = require('../../models/hr/Devices');
const HR_InfoLeaders = require('../../models/hr/InfoLeaders');
const HR_InfringesFors = require('../../models/hr/InfringesFors');
const FormData = require('form-data');
const axios = require('axios');
const { formRadioButton } = require('pdfkit');
const JobDes = require('../../models/hr/JobDescriptions');
const AnotherSkill = require('../../models/hr/AnotherSkill');
const PermisionDetail = require('../../models/hr/PermisionDetail');
const Remind = require('../../models/hr/Remind');
const ProcessInterview = require('../../models/hr/ProcessInterview');
const ProcessTraining = require('../../models/hr/ProcessTraining');
const SignatureImage = require('../../models/hr/SignatureImage');
const InviteInterview = require('../../models/hr/InviteInterview');
const ScheduleInterview = require('../../models/hr/ScheduleInterview');
const Recruitment = require('../../models/hr/Recruitment');
const RecruitmentNews = require('../../models/hr/RecruitmentNews');

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
                        if (query.recruitment_news[i].id_recruitment_news === Number(data[i].recruitment_news_id)) {
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
exports.stage_recruitment = async (req, res, next) => {
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
                        if (query.recruitment_news[i].id_recruitment_news === Number(data[i].recruitment_news_id)) {
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

// tool hr cường
exports.AchievementFors = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_achievements_for');
        let listUser = [];

        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let achievementId = data[i].achievement_id;
            if (data[i].list_user) {
                for (let j = 0; j < data[i].list_user.split(',').length; j++) {
                    listUser.push({ userId: data[i].list_user.split(',')[j], name: data[i].list_user_name.split(',')[j] });
                    console.log("🚀 ~ file: hr.js:224 ~ exports.AchievementFors= ~ listUser:", listUser)
                }
            }
            let content = data[i].content;
            let createdBy = data[i].created_by;
            let achievementAt = null;
            if (await functions.checkDate(data[i].achievement_at) === true) {
                achievementAt = data[i].achievement_at;
            }
            let achievementType = data[i].achievement_type;
            let appellation = data[i].appellation;
            let achievementLevel = data[i].achievement_level;
            let type = data[i].type;
            let comId = data[i].com_id;
            let depId = data[i].dep_id;
            let depName = data[i].dep_name;
            let createdAt = data[i].created_at;
            let updatedAt = data[i].updated_at;
            let AchievementFors = new HR_AchievementFors({
                _id, achievementId, content,
                createdBy, achievementAt, achievementType,
                appellation, achievementLevel, type, comId,
                depId, depName, createdAt, updatedAt, listUser
            });
            await AchievementFors.save();
        }
    }
    catch (error) {
        return functions.setError(res, error.message);
    }
}
// cancel job
exports.cancelJob = async (req, res, next) => {
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

exports.failJob = async (req, res, next) => {
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
};
exports.AddInfoLeads = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_add_info_lead');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let epId = data[i].ep_id;
            let nameDes = data[i].name_des;
            let description = data[i].description;
            let createdAt = data[i].created_at;
            let updatedAt = data[i].updated_at;
            let AddInfoLeads = new HR_AddInfoLeads({
                _id, epId, nameDes, description, createdAt, updatedAt
            });
            await AddInfoLeads.save();
        }
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// ContactJob

exports.contactJob = async (req, res, next) => {
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
            let data_recruitment = new HR_ContactJob({ _id, canId, isDelete, deletedAt, resiredSalary, note, salary, offerTime, epOffer, isSwitch, createdAt });
            await HR_ContactJob.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Blogs = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_blog');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let content = data[i].content;
            let comment = data[i].comment;
            let Blogs = new HR_Blogs({ _id, content, comment });
            await Blogs.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Categorys = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_category');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].cat_id);
            let name = data[i].cat_name;
            let title = data[i].cat_title;
            let tags = data[i].cat_tags;
            let description = data[i].cat_description;
            let keyword = data[i].cat_keyword;
            let parentId = data[i].cat_parent_id;
            let lq = data[i].cat_lq;
            let count = data[i].cat_count;
            let countVl = data[i].cat_count_vl;
            let order = data[i].cat_order;
            let active = data[i].cat_active;
            let hot = data[i].cat_hot;
            let ut = data[i].cat_ut;
            let only = data[i].cat_only;
            let except = data[i].cat_except;
            let tlq = data[i].cat_tlq;
            let tlqUv = data[i].cat_tlq_uv;

            let Categorys = new HR_Categorys({
                _id, name, title, tags, description, keyword, parentId,
                lq, count, countVl, order, active, hot, ut, only, except, tlq, tlqUv
            });

            await Categorys.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.CiSessions = async (req, res, next) => {
    try {
        let data1 = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_ci_sessions');
        for (let i = 0; i < data1.length; i++) {
            let _id = data1[i].id;
            let ipAddress = data1[i].ip_address;
            let timestamp = data1[i].timestamp;
            let data = data1[i].data;

            let CiSessions = new HR_CiSessions({
                _id, ipAddress,
                timestamp, data
            });
            await CiSessions.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Citys = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_city2');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].cit_id);

            let name = data[i].cit_name;
            let order = data[i].cit_order;
            let type = data[i].cit_type;
            let count = data[i].cit_count;
            let parentId = data[i].cit_parent;
            let Citys = new HR_Citys({ _id, name, order, type, count, parentId });
            await Citys.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.CrontabQuitJobs = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_achievements_for?page=1');
        let list = [];

        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let achievementId = data[i].achievement_id;
            let content = data[i].content;
            let createdBy = data[i].created_by;
            let achievementAt = null;
            let achievementType = data[i].achievement_type;
            let appellation = data[i].appellation;
            let achievementLevel = data[i].achievement_level;
            let type = data[i].type;
            let comId = data[i].com_id;
            let depId = data[i].dep_id;
            let depName = data[i].dep_name;
            let createdAt = data[i].created_at;
            let updatedAt = data[i].updated_at;
            let AchievementFors = new HR_AchievementFors({
                _id, achievementId, content,
                createdBy, achievementAt, achievementType,
                appellation, achievementLevel, type, comId,
                depId, depName, createdAt, updatedAt, list
            });
            await AchievementFors.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.DepartmentDetails = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_department_detail');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let comId = data[i].com_id;
            let depId = data[i].dep_id;
            let description = data[i].description;
            let DepartmentDetails = new HR_DepartmentDetails({ _id, comId, depId, description });
            await DepartmentDetails.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.DescPositions = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_desc_position');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let positionId = data[i].position_id;
            let comId = data[i].com_id;
            let description = data[i].description;
            let DescPositions = new HR_DescPositions({ _id, positionId, comId, description });
            await DescPositions.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.Devices = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_devices');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let userId = data[i].user_id;
            let infoBrower = data[i].info_brower;
            let tokenBrowser = data[i].token_browser;
            let lastLogin = data[i].last_login;
            let deviceType = data[i].device_type;
            let loginType = data[i].login_type;
            let createdAt = data[i].created_at;
            let Devices = new HR_Devices({ _id, userId, infoBrower, tokenBrowser, lastLogin, deviceType, loginType, createdAt });
            await Devices.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// Notify
exports.notify = async (req, res, next) => {
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
            let data_recruitment = new HR_Notifys({ _id, canId, type, comNotify, comId, userId, createdAt });
            await HR_Notifys.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.InfoLeaders = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_info_leader');
        // let avatar = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_leader_avt');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let epId = data[i].ep_id;
            let description = data[i].description;
            let desPosition = data[i].des_position;
            let createdAt = data[i].created_at;
            let updatedAt = data[i].updated_at;
            let InfoLeaders = new HR_InfoLeaders({ _id, epId, description, desPosition, createdAt, updatedAt });
            await InfoLeaders.save();
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.InfringesFors = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_infringes_for');
        let listUser = [];

        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let infringeName = data[i].infringe_name;
            if (data[i].list_user) {
                for (let j = 0; j < data[i].list_user.split(',').length; j++) {
                    listUser.push({ userId: data[i].list_user.split(',')[j], name: data[i].list_user_name.split(',')[j] });
                }
            }
            let regulatoryBasis = data[i].regulatory_basis;
            let numberViolation = data[i].number_violation;
            let createdBy = data[i].created_by;
            let infringeAt = data[i].infringe_at;
            if (await functions.checkDate(infringeAt) === false) continue
            let infringeType = data[i].infringe_type;
            let type = data[i].type;
            let comId = data[i].com_id;
            let depId = data[i].dep_id;
            let depName = data[i].dep_name;
            let createdAt = data[i].created_at;
            let updatedAt = data[i].updated_at;
            let InfringesFors = new HR_InfringesFors({
                _id,
                infringeName, regulatoryBasis, numberViolation, createdBy
                , infringeAt, infringeType, type, comId, depId, depName, createdAt, updatedAt, listUser
            });
            await InfringesFors.save();
        }
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// permission
exports.permission = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_permision?page=1');
        for (let i = 0; i < data.length; i++) {
            let _id = Number(data[i].id);
            let namePer = data[i].name_per;
            // const check_id = await HR_Cancel.findById(_id);
            // if (!check_id || check_id.length === 0) {
            let data_recruitment = new HR_Permisions({ _id, namePer });
            await HR_Permisions.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
}

// policys
exports.policy = async (req, res, next) => {
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
            let data_recruitment = new HR_Policys({ _id, provisionId, timeStart, supervisorName, applyFor, content, createdBy, isDelete, createdAt, name, file, deletedAt });
            await HR_Policys.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.avatar = async (req, res, next) => {
    try {
        let data = await functions.getDataAxios('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_leader_avt');
        for (let i = 0; i < data.length; i++) {
            let check = await HR_InfoLeaders.find({ epId: data[i].ep_id })
            if (check && check.length !== 0) {
                console.log('2')
                await HR_InfoLeaders.findOneAndUpdate({ epId: data[i].ep_id }, { avatar: data[i].avatar })
            }
        }
    } catch (error) {
        return functions.setError(res, error)
    }
}
//stageRecruitment
exports.stageRecruitment = async (req, res, next) => {
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
            let data_recruitment = new HR_StageRecruitments({ _id, recruitmentId, name, positionAssumed, target, complete_time, description, isDelete });
            await HR_StageRecruitments.create(data_recruitment);
            // }
        }
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};
exports.toolInfringe = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_infringes_for', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const infringe = new Infringe({
                        _id: data[i].id,
                        infringeName: data[i].infringe_name,
                        regulatoryBasis: data[i].regulatory_basis,
                        numberViolation: data[i].number_violation,
                        listUser: data[i].list_user,
                        listUserName: data[i].list_user_name,
                        createdBy: data[i].created_by,
                        infringeAt: data[i].infringe_at,
                        infringeType: data[i].infringe_type,
                        type: data[i].type,
                        companyId: data[i].com_id,
                        depId: data[i].dep_id,
                        depName: data[i].dep_name,
                        createdAt: new Date(data[i].created_at),
                        updatedAt: new Date(data[i].updated_at)
                    });
                    await Infringe.create(infringe);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolJobDes = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_job_description', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const jobDes = new JobDes({
                        _id: data[i].id,
                        name: data[i].name,
                        depName: data[i].department_name,
                        des: data[i].description,
                        jobRequire: data[i].job_require,
                        roadMap: data[i].road_map,
                        comId: data[i].com_id,
                        createdAt: data[i].created_at,
                        updatedAt: data[i].updated_at,
                        deletedAt: data[i].deleted_at,
                        isDelete: data[i].is_delete
                    });
                    await JobDes.create(jobDes);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);
        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolAnotherSkill = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_another_skill', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const anotherSkill = new AnotherSkill({
                        _id: data[i].id,
                        canId: data[i].can_id,
                        skillName: data[i].skill_name,
                        skillVote: data[i].skill_vote,
                        createAt: data[i].created_at
                    });
                    await AnotherSkill.create(anotherSkill);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolPermisionDetail = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_per_detail', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const permisionDetail = new PermisionDetail({
                        _id: data[i].id,
                        perId: data[i].id_per,
                        actName: data[i].action_name,
                        actCode: data[i].action_code,
                        checkAct: data[i].check_action
                    });
                    await PermisionDetail.create(permisionDetail);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolRemind = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_remind', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const remind = new Remind({
                        _id: data[i].id,
                        type: data[i].type,
                        remindType: data[i].remind_type,
                        canId: data[i].can_id,
                        canName: data[i].can_name,
                        comId: data[i].com_id,
                        userId: data[i].user_id,
                        time: data[i].time,
                        createdAt: data[i].created_at
                    });
                    await Remind.create(remind);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolProcessInterview = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_process_interview', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const processInterview = new ProcessInterview({
                        _id: data[i].id,
                        name: data[i].name,
                        processBefore: data[i].process_before,
                        comId: data[i].com_id,
                        createdAt: data[i].created_at
                    });
                    await ProcessInterview.create(processInterview);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolProcessTraining = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_training_process', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const processTraining = new ProcessTraining({
                        _id: data[i].id,
                        name: data[i].name,
                        description: data[i].description,
                        comId: data[i].com_id,
                        isDelete: data[i].is_delete,
                        createdAt: data[i].created_at,
                        updatedAt: data[i].updated_at,
                        deletedAt: data[i].deleted_at
                    });
                    await ProcessTraining.create(processTraining);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolSignatureImage = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_signature_image', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const signatureImage = new SignatureImage({
                        _id: data[i].id,
                        empId: data[i].ep_id,
                        imgName: data[i].image_name,
                        createdAt: data[i].created_at,
                        isDelete: data[i].is_delete,
                        deletedAt: data[i].deleted_at
                    });
                    await SignatureImage.create(signatureImage);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolInviteInterview = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_invite_interview', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const signatureImage = new InviteInterview({
                        _id: data[i].id,
                        posApply: data[i].position_apply,
                        canId: data[i].candidate_id,
                        canEmail: data[i].candidate_email,
                        canName: data[i].candidate_name,
                        hrName: data[i].hr_name,
                        content: data[i].content,
                        note: data[i].note,
                        noteTest: data[i].note_test,
                    });
                    await InviteInterview.create(signatureImage);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolScheduleInterview = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_tbl_schedule_interview', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const scheduleInterview = new ScheduleInterview({
                        _id: data[i].id,
                        posApply: data[i].position_apply,
                        canId: data[i].candidate_id,
                        canEmail: data[i].candidate_email,
                        canName: data[i].candidate_name,
                        hrName: data[i].hr_name,
                        content: data[i].content,
                        note: data[i].note,
                        noteTest: data[i].note_test,
                    });
                    await ScheduleInterview.create(scheduleInterview);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolRecruitment = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_recruitment', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const recruitment = new Recruitment({
                        _id: data[i].id,
                        name: data[i].name,
                        createdBy: data[i].created_by,
                        createdAt: data[i].created_at,
                        deletedAt: data[i].deleted_at,
                        isDelete: data[i].is_delete,
                        applyFor: data[i].apply_for,
                        slug: data[i].slug,
                        comId: data[i].com_id,
                        isCom: data[i].is_com
                    });
                    await Recruitment.create(recruitment);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

exports.toolRecruitmentNews = async (req, res, next) => {
    try {
        console.log(".....")
        let page = 1;
        let result = true;
        do {
            const form = new FormData();
            form.append('page', page);
            const response = await axios.post('https://phanmemnhansu.timviec365.vn/api/Nodejs/get_recruitment_news', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            let data = response.data;
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const recruitmentNews = new RecruitmentNews({
                        _id: data[i].id,
                        title: data[i].title,
                        posApply: data[i].position_apply,
                        cityId: data[i].cit_id,
                        address: data[i].address,
                        cateId: data[i].cate_id,
                        salaryId: data[i].salary_id,
                        number: data[i].number,
                        timeStart: data[i].recruitment_time,
                        timeEnd: data[i].recruitment_time_to,
                        jobDetail: data[i].job_detail,
                        wokingForm: data[i].woking_form,
                        probationaryTime: data[i].probationary_time,
                        moneyTip: data[i].money_tip,
                        jobDes: data[i].job_description,
                        interest: data[i].interest,
                        recruitmentId: data[i].recruitmen_id,
                        jobExp: data[i].job_exp,
                        degree: data[i].degree,
                        gender: data[i].gender,
                        jobRequire: data[i].job_require,
                        memberFollow: data[i].member_follow,
                        hrName: data[i].hr_name,
                        createdAt: data[i].created_at,
                        updatedAt: data[i].updated_at,
                        deletedAt: data[i].deleted_at,
                        isDelete: data[i].is_delete,
                        comId: data[i].com_id,
                        isCom: data[i].is_com,
                        createdBy: data[i].created_by,
                        isSample: data[i].is_sample
                    });
                    await RecruitmentNews.create(recruitmentNews);
                }
                page++;
            } else {
                result = false;
            }
            console.log(page);
        } while (result);

        return functions.success(res, "Thành công");
    } catch (error) {
        return functions.setError(res, error.message);
    }
};

