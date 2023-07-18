const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CalendarWorkEmployee = new Schema({
    epcy_id: {//ID danh sách nhân viên có lịch làm việc
        type: Number,
        required: true
    },
    idQLC: {
        type: Number
    },
    cy_id: {//ID lịch làm việc
        type: Number
    },
    update_time: {//thời điểm áp dụng
        type: Date
    },

})

module.exports = mongoose.model('QLC_Employee_cycle', CalendarWorkEmployee);