const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarWorkEmployee = new Schema({
    _id: {//ID danh sách lịch làm việc cho nhân viên
        type: Number,
        required: true
    },
    employeeID: {
        type: Number
    },
    companyID: {//ID cty
        type: Number
    },
    calendarID: {//ID lịch làm việc
        type: Number
    },
    timeApply: {//thời điểm áp dụng
        type: Date
    },
    Detail: { //chi tiết
        type: String
    },
    // Status: { //chua biet
    //     type: String
    // },
    // isPersonal: { //chua biet
    //     type: String
    // },
})

module.exports = mongoose.model('CalendarWorkEmployee', CalendarWorkEmployee);