const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruitmentStageSchema = new Schema({
    // id stage recruitment
    _id: { type: Number, required: true },
    // id tin tuyê dụng
    recruitmentId: { type: Number, required: true },
    // tên stageRecruitment
    name: { type: String, required: true },
    // vị trí tuyển dụng
    positionAssumed: { type: String, required: true },
    // target
    target: { type: String, required: true },
    //  thời gian hoàn thành
    complete_time: { type: String, required: true },
    //  chi tiết
    description: { type: String, required: true },
    //  trạng thái xóa
    isDelete: { type: Number, required: true }
}, {
    collection: 'HR_StageRecruitments',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_StageRecruitments', RecruitmentStageSchema);

