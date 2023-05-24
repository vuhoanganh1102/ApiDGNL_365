const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarWorkEmployee = new Schema({
    _id: {
        type: Number,
        required: true
    },
    employeeId: {
        type: Number
    },
    calendaraId: {
        type: Number
    }
})

//module.exports = mongoose.model('CalendarWorkEmployee', CalendarWorkEmployee);