const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const failJob = new Schema({
    // ID Job Fail
    _id: { type: Number, required: true },
    // ID ứng vien
    canId: { type: String, required: true },
    // kiểu
    type: { type: String },
    // Xóa hay chưa
    isDelete: { type: Number, default: 0 },
    // xóa vào thời gian nào
    deletedAt: { type: Date },
    //  Note
    note: { type: String, required: false },
    // email
    email: { type: String },
    // nội dung gửi
    contentsend: { type: String },
    //
    isSwitch: { type: Number, default: 0 },
    // ngày tạo
    createdAt: { type: Date, required: true },
}, {
    collection: 'HR_FailJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_FailJobs', failJob);

