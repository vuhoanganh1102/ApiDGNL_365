const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShiftCalendarSchema = new Schema({
    //ID của mối liên hệ ca vs lịch làm việc
    _id: {
        type: Number,
        require: true
    },
    //ID của ca làm việc
    shiftId: {
        type: Number,
    },
    //ID của lịch làm việc
    calendarId: {
        type: Number,
    },
    //Ngày diễn ra lịch với ca làm việc đó
    date: {
        type: Date
    }
})

//module.exports = mongoose.model("ShiftCalendars", ShiftCalendarSchema)