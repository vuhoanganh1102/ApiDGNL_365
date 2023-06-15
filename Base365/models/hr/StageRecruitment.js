const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecruitmentStageSchema = new Schema({
    // id
    _id: { type: Number, required: true },
    // id tin tuyê dụng
    recruitmentId: { type: Number, required: true },
    // tên giai doan
    name: { type: String, required: true },
    // bo phan dam nhiem
    positionAssumed: { type: String, required: true },
    // muc tieu
    target: { type: String, required: true },
    //  thời gian 
    completeTime: { type: String, default: null },
    //  mo ta cong viec
    description: { type: String, default: null },
    //  trạng thái xóa
    isDelete: { type: Number, required: true }
}, {
    collection: 'HR_StageRecruitments',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_StageRecruitments', RecruitmentStageSchema);

