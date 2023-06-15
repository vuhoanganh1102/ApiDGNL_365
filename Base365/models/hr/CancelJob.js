const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CancelJob = new Schema({
    // ID Job Fail
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    // ID ứng vien
    canId: { type: String, required: true },
    // kiểu
    type: { type: String },
    // Xóa hay chưa
    isDelete: { type: Number, default: 0 },
    // xóa vào thời gian nào
    deletedAt: { type: Date },
    //    lương hưu
    resiredSalary: { type: String  },
    //     Luoơng
    salary: { type: String },
    //  Note
    note: { type: String, required: false },
    //     Trạng thái
    status: { type: Number},
    //
    isSwitch: { type: Number, default: 0 },
    // ngày tạo
    createdAt: { type: Date, required: true }
},  {
    collection: 'HR_CancelJobs',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model('HR_CancelJobs', CancelJob);

