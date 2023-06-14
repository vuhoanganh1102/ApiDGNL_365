const functions = require('../../services/functions');
const Recruitment = require('../../models/hr/Recruitments.js');
const { formRadioButton } = require('pdfkit');

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