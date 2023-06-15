const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobOfferSchema = new Schema({
    // id contact job
    id: {
        type: Number,
        required: true,
        unique: true,
        autoIncrement: true
    },
    //  ID ứng viên
    canId: { type: Number, required: true },
    // trạng thái xóa
    isDelete: { type: Number, required: true },
    // xóa vào ngày?
    deletedAt: { type: Date },
    // lương hưu
    resiredSalary: { type: String, required: true },
    // lương
    salary: { type: String, required: true },
    // ngày nhận offer
    offerTime: { type: Date, required: true },
    //
    epOffer: { type: Number, required: true },
    // ghi chú
    note: { type: String },
    // chuyển trạng thái
    isSwitch: { type: String, required: true },
    // ngày tạo
    createdAt: { type: Date, required: true }
}, {
    collection: 'HR_ContactJobs',
    versionKey: false,
    timestamp: true
});

const JobOfferModel = mongoose.model('HR_ContactJobs', JobOfferSchema);

module.exports = JobOfferModel;
