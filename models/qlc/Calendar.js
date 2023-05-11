const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarSchema = new Schema({
    //Id lịch làm việc
    _id: {
        type: Number,
        require: true
    },
    //Tên của lịch làm việc
    calendarName: {
        type: String,
    },
    //Thời điểm tạo lịch làm việc
    createdAt: {
        type: Date,
        default: Date.now()
    },
    //Thời gian áp dụng (theo tháng)
    timeApply: {
        type: Date
    },
    //Id lịch làm việc
    idCalendarWork: {
        type: Number
    },
    //Lịch làm việc
    workCalendar: {
        type: String
    },
    //Ngày bắt đầu áp dụng 
    timeStart: {
        type: Date
    },
    //Có phải copy
    isCopy: {
        type: Boolean
    },
    //Thời điềm copy nền không phải copy thì là null
    timeCopy: {
        type: Date,
        default: isCopy ? Date.now() : null
    }

});

module.exports = mongoose.model("Calendars", CalendarSchema);