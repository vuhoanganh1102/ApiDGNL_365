const functions = require('../../services/functions');
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

exports.toolInfringe = async(req, res, next) => {
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

exports.toolJobDes = async(req, res, next) => {
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
                        createdAt:  data[i].created_at,
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

exports.toolAnotherSkill = async(req, res, next) => {
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

exports.toolPermisionDetail = async(req, res, next) => {
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

exports.toolRemind = async(req, res, next) => {
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
                        type:  data[i].type,
                        remindType:  data[i].remind_type,
                        canId:  data[i].can_id,
                        canName:  data[i].can_name,
                        comId:  data[i].com_id,
                        userId:  data[i].user_id,
                        time:  data[i].time,
                        createdAt:  data[i].created_at
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

exports.toolProcessInterview = async(req, res, next) => {
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

exports.toolProcessTraining = async(req, res, next) => {
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
                        name:  data[i].name,
                        description:  data[i].description,
                        comId:  data[i].com_id,
                        isDelete:  data[i].is_delete,
                        createdAt:  data[i].created_at,
                        updatedAt:  data[i].updated_at,
                        deletedAt:  data[i].deleted_at
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

exports.toolSignatureImage = async(req, res, next) => {
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

exports.toolInviteInterview = async(req, res, next) => {
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

exports.toolScheduleInterview = async(req, res, next) => {
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

exports.toolRecruitment = async(req, res, next) => {
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

exports.toolRecruitmentNews = async(req, res, next) => {
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