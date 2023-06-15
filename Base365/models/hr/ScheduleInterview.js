const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ScheduleInterviewSchema = new Schema({
    // id
    _id: {
        type: Number,
        require: true
    },
    // id ung vien
    canId: {
        type: Number,
        require: true
    },
    // id nhan vien phong van
    empInterview: {
        type: Number,
        require: true
    },
    // id cua quy trinh phong van
    processInterviewId: {
        type: Number,
        require: true,
    },
    // email cua ung vien
    canEmail: {
        type: String,
        default: null
    },
    // luong huu
    resiredSalary: {
        type: Number,
        default: 0
    },
    // luong co ban
    salary: {
        type: Number,
        default: 0
    },
    // thời gian phong van
    interviewTime: {
        type: Date,
        default: Date.now()
    },
    // noi dung 
    contentsend: {
        type: String,
        default: null,
    },
    //chua ro
    isSwitch: {
        type: Number,
        default: 0,
    },
    // ghi chu
    note: {
        type: String,
        default: null,
    },
    // id nhan vien quan ly khach hang
    empCrmId: {
        type: Number,
        default: 0,
    },
    // thoi gian tao
    createdAt: {
        type: Date,
        default: Date.now(),
    }
},{
    collection: 'HR_ScheduleInterviews',
    versionKey: false,
    timestamp: true
});

module.exports = mongoose.model("HR_ScheduleInterviews",ScheduleInterviewSchema);
