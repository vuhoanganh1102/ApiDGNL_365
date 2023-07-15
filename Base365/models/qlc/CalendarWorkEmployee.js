const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Employee_cycle = new Schema({
    epcy_id: {//ID danh sách nhân viên có lịch làm việc
        type: Number,
        required: true
    },
    ep_id: {
        type: Number
    },
    cy_id: {//ID lịch làm việc
        type: Number
    },
    update_time: {//thời điểm áp dụng
        type: Date,
        default : new Date(),
    },

})

module.exports = mongoose.model('QLC_Employee_cycle', Employee_cycle);